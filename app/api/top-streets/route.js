import { getTopStreets } from "@/utilities/streetParseRanker";
/*
    
    API endpoint to GET JSON data containing property info by neighborhood
    Filters and processes data 
        Calculates candy likelihood of each property
        Groups properties by street name
        Ranks streets by score
    Returns queried number of top streets 
*/

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const neighborhood = searchParams.get("neighborhood");
        const count = Number(searchParams.get("count") || 5);

        if (!neighborhood) {
            return new Response(
                JSON.stringify({ error: "Missing parameter: neighborhood" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const sfDataURL = `https://data.sfgov.org/resource/wv5m-vpq2.json?$select=parcel_number,property_location,current_sales_date,property_class_code_definition,use_definition,assessor_neighborhood,number_of_units,year_property_built,number_of_stories&$where=assessor_neighborhood='${encodeURIComponent(neighborhood)}' AND number_of_units > 0 AND use_definition IN ('Single Family Residential','Multi-Family Residential','Condominium')&$limit=500000&$order=parcel_number`;

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
        const topStreets = getTopStreets(properties, count);

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