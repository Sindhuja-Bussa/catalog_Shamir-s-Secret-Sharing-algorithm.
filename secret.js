

const fs = require('fs'); // Import file system module

// Convert value from specific base to decimal
function decodeValue(base, value) 
{
    return parseInt(value, base);
}

// Compute constant term using Lagrange Interpolation method
function ConstantTerm(points) 
{
    let constantTerm = 0;
    for (let i = 0; i < points.length; i++) 
        {
            let xi = points[i].x;
            let yi = points[i].y;

            // Calculate product term for Lagrange basis polynomial
            let pro = yi;
            for (let j = 0; j < points.length; j++) 
                {
                    if (i !== j) 
                        {
                            let xj = points[j].x;
                            pro *= (xj / (xj - xi));
                        }
                }
            constantTerm += pro;

        }
            return Math.round(constantTerm); // Round result to nearest integer
}

// Extract secret constant term from JSON data
function secretFromJSON(jsonFile) 
{
// Load and parse JSON file contents
    const data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
    const n = data.keys.n;
    const k = data.keys.k;

// Validate number of provided points
if (n < k) 
{
    throw new Error("Insufficient points to solve polynomial.");
}

const points = []; // Initialize array to store points
// Iterate through JSON data and extract points
for (const key in data) 
{
    if (key === "keys") continue;
    const x = parseInt(key);
    const base = parseInt(data[key].base);
    const y = decodeValue(base, data[key].value);
    points.push({ x, y });
}

// Sort points by x-coordinate
points.sort((a, b) => a.x - b.x);

// Select first k points
const selectedPoints = points.slice(0, k);
return ConstantTerm(selectedPoints);
}

// Run test cases
try 
{
    const secret1 = secretFromJSON('testcase1.json');
    console.log("Secret constant (c) for testcase1.json:", secret1);

    const secret2 = secretFromJSON('testcase2.json');
    console.log("Secret constant (c) for testcase2.json:", secret2);
} 
catch (error) 
{
    console.error("Error:", error.message);
}