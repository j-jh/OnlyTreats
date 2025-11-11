/*
    route: /api/neighborhoods 
    ---
    GET API endpoint
    Fetch and sort list of all San Francisco neighborhoods from data.sfgov.org API 
    ---
    Headers:
        Content-Type: application
    HTTP Query Params: null
    Function Params: null
        
    Behaviors:
    - Fetch neighborhood JSON data from data.sfgov.org API
    - Return error on API failure
    - Sort neighborhood names by alphabetical order

    Response JSON: 
    - Return list of sorted neighborhoods on success

    Errors:
    - 500: Failure on data.sfgov.org API
*/
export async function GET() {
    try {
        const sfDataResults = await fetch('https://data.sfgov.org/resource/dx7g-zwbx.json?$select=neighborhood&$order=neighborhood');

        if (!sfDataResults.ok) {
            return new Response(
                JSON.stringify({ error: "data.sfgov.org API error: " + sfDataResults.status }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }
        const data = await sfDataResults.json();
        const neighborhoods = data.map(item => item.neighborhood);
        neighborhoods.sort((a, b) => a.localeCompare(b)); 

        return new Response(JSON.stringify(neighborhoods), {
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