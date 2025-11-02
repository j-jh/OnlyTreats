/*
    /utilities/streetParseRanker.js

    AI GENERATED REGEX BASED PARSER
    
    getTopStreets(properties, count):
        Returns list of count top streets based on score calculation from properties dataset 
    ---
    Params:
        - properties: list of properties from data.sfgov.org database
        - count: number of properties to return
    Behaviors:
        - Group properties by street name
        - Average score of each property by number of properties on given street
        - Filter small streets with less than 3 properties
        - Rank streets based on average score of properties
        - Return list of objects, each containing:
        {
            street: street name from extracted street name
            score: integer from calculated candy score
            num_houses: total number of properties
            num_units: total number of units 
        }
        
    ---
    extractStreetNames(location):
        Parses and normalizes street names from raw strings in dataset
        Ex: '0000 1038APINE                ST0000' -> PINE ST
    ---
    Params:
        - location: property location
    Behaviors:
        - Regex to parse street name
            - White space
            - Digit + Suffix (34TH)
            - Named streets + Suffix (Van Ness Av)
        
    calculateCandyScore(property):
        Calculates candy likelihood score from given property

        Algorithm:
    
        Factors in property sale date, density per property, and property type.

        Older sale dates, lower density, and single family homes are given a higher score.
        Recent sale dates, higher denesity, and higher unit apartments are given a lower score.

        Sale date: (current year - year last sold) compared to metric
        Density: (number of units on property) compared to  metric
        Property type: (property type) with assigned score
        
    ---
    Params:
        - property: property to calculate
    Behaviors:
        - Assign score per factor based on algorithm
        - Return score for given property
*/
export function getTopStreets(properties, count) {
    // Extract street name from property_location
    function extractStreetName(location) {
        if (!location) return null;

        // Collapse spaces first
        let cleaned = location.replace(/\s+/g, ' ').trim();

        // Handle numbered streets specially (22ND AV, 35TH ST, etc.)
        // Match: digits + ordinal suffix (ST/ND/RD/TH) + space + actual suffix (AV/ST/BL etc)
        const numberedStreetMatch = cleaned.match(/(\d+(?:ST|ND|RD|TH))\s+(AV|AVENUE|ST|STREET|BL|BLVD|CT|DR|DRIVE|WAY|WY|PL)/i);
        if (numberedStreetMatch) {
            const number = numberedStreetMatch[1];
            const suffix = numberedStreetMatch[2].toUpperCase();

            // Standardize suffix
            const suffixMap = {
                'AVENUE': 'AV',
                'STREET': 'ST',
                'BOULEVARD': 'BL',
                'BLVD': 'BL',
            };

            const normalizedSuffix = suffixMap[suffix] || suffix;
            return `${number} ${normalizedSuffix}`;
        }

        // Original logic for named streets
        const match = cleaned.match(/(?:\d+\s+)*\d+[A-Z]?\s*([A-Z][A-Z\s]+?)\s+(ST|AV|AVENUE|STREET|BL|BLVD|CT|COURT|DR|DRIVE|RD|ROAD|LN|LANE|WY|WAY|PL|PLACE)\d*/i);
        if (match) {
            let streetName = match[1].trim().replace(/\s+/g, ' ');
            const suffix = match[2].toUpperCase();

            // Remove leading "V" ONLY if it's immediately followed by another capital letter
            streetName = streetName.replace(/^V([A-Z])/, '$1');

            // Standardize suffix
            const suffixMap = {
                'AVENUE': 'AV',
                'STREET': 'ST',
                'BOULEVARD': 'BL',
                'BLVD': 'BL',
                'COURT': 'CT',
                'DRIVE': 'DR',
                'ROAD': 'RD',
                'LANE': 'LN',
                'WAY': 'WY',
                'PLACE': 'PL'
            };

            const normalizedSuffix = suffixMap[suffix] || suffix;
            return `${streetName} ${normalizedSuffix}`;
        }

        return null;
    }

    function calculateCandyScore(property) {
        let score = 0;

        // Base score
        score += 10;

        // AGE FACTOR: Older properties score higher (max +15 points)
        if (property.current_sales_date) {
            const saleYear = new Date(property.current_sales_date).getFullYear();
            const yearsSinceSale = 2025 - saleYear;

            if (yearsSinceSale >= 20) score += 15;
            else if (yearsSinceSale >= 10) score += 10;
            else if (yearsSinceSale >= 5) score += 5;
            else score += 2;
        } else {
            // Date not noted, likely older proprety
            score += 12;
        }

        const units = parseInt(property.number_of_units) || 1;

        // PROPERTY TYPE FACTOR: Use the detailed property_class_code_definition
        const propType = property.property_class_code_definition || '';

        // TRUE SINGLE FAMILY HOMES - Best for trick-or-treating!
        if (propType === 'Dwelling') {
            score += 40; // HUGE bonus for true single-family homes
        }
        // SMALL MULTI-FAMILY - Still decent
        else if (propType.includes('Flats & Duplex') ||
            propType.includes('2 Dwellings on 1 Parcel')) {
            score += 15;
        }
        else if (propType.includes('Apartment 4 units or less') ||
            propType.includes('Flat & Store 4 units or less')) {
            score += 10;
        }
        // CONDOS AND LARGER BUILDINGS - Poor for trick-or-treating
        else if (propType.includes('Condominium') ||
            propType.includes('Live/Work')) {
            score -= 10; // NEGATIVE for condos
        }
        else if (propType.includes('Apartment 5 to 14') ||
            propType.includes('Flat & Store 5 to 14')) {
            score -= 15;
        }
        else if (propType.includes('Apartment 15') ||
            propType.includes('15 units')) {
            score -= 25; // Heavy penalty for large apartment buildings
        }
        // Everything else gets a small penalty
        else {
            score += 0;
        }

        // Additional penalty for high unit count per property
        if (units > 20) score -= 20;
        else if (units > 10) score -= 15;
        else if (units > 4) score -= 8;
        else if (units > 2) score -= 3;

        return Math.max(score, 0);
    }
    // Group properties by street
    const streetData = {};

    properties.forEach(property => {

        const streetName = extractStreetName(property.property_location);
        if (!streetName) {
            console.log("Failed to extract:", property.property_location);
        }
        if (!streetName) return;

        const candyScore = calculateCandyScore(property);
        const units = parseInt(property.number_of_units) || 1;

        if (!streetData[streetName]) {
            streetData[streetName] = {
                street: streetName,
                totalScore: 0,
                propertyCount: 0,
                totalUnits: 0
            };
        }

        streetData[streetName].totalScore += candyScore;
        streetData[streetName].propertyCount += 1;
        streetData[streetName].totalUnits += units;
    });

    // Calculate average scores and format results
    const minPropertiesPerStreet = 3;

    const rankedStreets = Object.values(streetData)
        .filter(street => street.propertyCount >= minPropertiesPerStreet) // remove small streets
        .map(street => ({
            street: street.street,
            score: Math.round((street.totalScore / street.propertyCount) * 10) / 10,
            num_houses: street.propertyCount,
            num_units: street.totalUnits
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, count);

    return rankedStreets;
}

