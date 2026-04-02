/*
    route: /api/neighborhoods 
    ---
    GET API endpoint
    Return hardcoded list of all San Francisco neighborhoods
    ---
    Headers:
        Content-Type: application/json
    HTTP Query Params: null
    Function Params: null
        
    Behaviors:
    - Return hardcoded list of SF neighborhoods (sorted alphabetically)
    - Instant response, no external API calls

    Response JSON: 
    - Return list of neighborhoods on success
*/
export function GET() {
    const neighborhoods = [
        "Alamo Square",
        "Anza Vista",
        "Balboa Terrace",
        "Bayview",
        "Bayview Heights",
        "Bernal Heights",
        "Bernal Heights South",
        "Buena Vista Park/Ashbury Heights",
        "Candlestick Point",
        "Central Richmond",
        "Central Sunset",
        "Central Waterfront/Dogpatch",
        "Clarendon Heights",
        "Cole Valley/Parnassus Heights",
        "Corona Heights",
        "Cow Hollow",
        "Croker Amazon",
        "Diamond Heights",
        "Downtown",
        "Duboce Triangle",
        "Eureka Valley/Dolores Heights",
        "Excelsior",
        "Financial District North",
        "Financial District South",
        "Forest Hill",
        "Forest Hill Extension",
        "Forest Knolls",
        "Glen Park",
        "Golden Gate Heights",
        "Haight Ashbury",
        "Hayes Valley",
        "Hunters Point",
        "Ingleside",
        "Ingleside Heights",
        "Ingleside Terrace",
        "Inner Mission",
        "Inner Parkside",
        "Inner Richmond",
        "Inner Sunset",
        "Jordan Park/Laurel Heights",
        "Lake Shore",
        "Lake Street",
        "Lakeside",
        "Little Hollywood",
        "Lone Mountain",
        "Lower Pacific Heights",
        "Marina",
        "Merced Heights",
        "Merced Manor",
        "Midtown Terrace",
        "Miraloma Park",
        "Mission Bay",
        "Mission Dolores",
        "Mission Terrace",
        "Monterey Heights",
        "Mount Davidson Manor",
        "Nob Hill",
        "Noe Valley",
        "North Beach",
        "North Panhandle",
        "North Waterfront",
        "Oceanview",
        "Outer Mission",
        "Outer Parkside",
        "Outer Richmond",
        "Outer Sunset",
        "Pacific Heights",
        "Parkside",
        "Pine Lake Park",
        "Portola",
        "Potrero Hill",
        "Presidio Heights",
        "Russian Hill",
        "Sea Cliff",
        "Sherwood Forest",
        "Silver Terrace",
        "South Beach",
        "South of Market",
        "St. Francis Wood",
        "Stonestown",
        "Sunnyside",
        "Telegraph Hill",
        "Tenderloin",
        "Treasure Isl./Yerba Buena Isl.",
        "Twin Peaks",
        "Union Square",
        "Van Ness/ Civic Center",
        "Visitacion Valley",
        "West Portal",
        "Western Addition",
        "Westwood Highlands",
        "Westwood Park",
        "Yerba Buena"
    ];

    return new Response(JSON.stringify(neighborhoods), {
        headers: { "Content-Type": "application/json" },
    });
}