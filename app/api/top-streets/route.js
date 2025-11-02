import { getTopStreets } from "@/utilities/streetParseRanker";
/*
    route: /api/top-streets
    --- 
    GET API endpoint 
    Fetch properties for given neighborhood from data.sfgov.org API, filter and process data, and return top streets
    ---
    Headers:
        Content-Type: application

    HTTP Query Parameters:
    - neighborhood: string for SF neighborhood
    - count: Number for number of streets to return

    Function Params:
    - req: request object for HTTP request

    Behaviors
    - Parse query params from request object
    - Sanitize count
    - Return error on missing param
    - Sanitize URL params
    - Fetch data, return error on failure
    - getTopStreets() to return list of ranked street objects 

    Response JSON: 
    - Returns list of top ranked street objects success

    Errors:
    - 400: Missing parameter
    - 500: Failure on data.sfgov.org API
*/

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const neighborhood = searchParams.get("neighborhood");
        /*
            Ensures that count:
                Only pos int
                Default to 3
                Cap at 50
        */
        const rawCount = Number(searchParams.get("count"));
        const count = Number.isFinite(rawCount) && rawCount > 0 ? Math.min(rawCount, 50) : 3;

        if (!neighborhood) {
            return new Response(
                JSON.stringify({ error: "Missing parameter: neighborhood" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }
        const sfDataURL = `https://data.sfgov.org/resource/wv5m-vpq2.json?` +
            `$select=parcel_number,property_location,current_sales_date,property_class_code_definition,use_definition,assessor_neighborhood,number_of_units,year_property_built,number_of_stories` +
            `&$where=assessor_neighborhood='${neighborhood}' AND number_of_units > 0 AND use_definition IN ('Single Family Residential','Multi-Family Residential','Condominium')` +
            `&$limit=500000` +
            `&$order=parcel_number`;
        console.log("Fetching URL:", sfDataURL);
        console.log("Neighborhood param:", neighborhood);
        const sfDataResults = await fetch(sfDataURL);


        if (!sfDataResults.ok) {
            return new Response(
                JSON.stringify({ error: "data.sfgov.org API error: " + sfDataResults.status }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const properties = await sfDataResults.json();

        console.log(`${neighborhood} returned ${properties.length} properties`);
        console.log("First 3 properties:", properties.slice(0, 3));

        const topStreets = getTopStreets(properties, count);
        console.log(`${neighborhood} top streets:`, topStreets);
        return new Response(JSON.stringify(topStreets), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: "data.sfgov.org server error: " + error.message }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}