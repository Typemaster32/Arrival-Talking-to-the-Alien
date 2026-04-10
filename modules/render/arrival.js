// Arrival ring generation algorithm

/**
 * Generate the alien language ring pattern
 * Returns an array of line segments [pointA, pointB]
 * 
 * @param {number} radius - Ring radius
 * @param {p5.Vector} center - Center position
 * @param {number} angNum - Number of angles
 * @param {number} notchWidth - Width of notches
 * @returns {Array} - Array of line segments
 */
function generateArrival(radius, center, angNum, notchWidth) {
    const arrayOfArrival = [];
    const config = RenderConfig;
    
    // Generate random notches and branches
    const notchNum = floor(random(config.notchMax));
    const branchNum = floor(random(config.notchMax)) * config.branchMax;
    
    const notches = [];
    const branches = [];
    
    // Generate notches (gaps in the ring)
    let startNotch = 0;
    for (let i = 0; i < notchNum; i++) {
        const thisNotch = random(startNotch, (angNum * (1 + i)) / notchNum);
        notches.push(thisNotch);
        startNotch = thisNotch;
    }
    
    // Generate branches (extensions from the ring)
    for (let j = 0; j < branchNum; j++) {
        let thisBranch;
        let thisBranchCollapse = true;
        
        // Ensure branches don't overlap with notches
        while (thisBranchCollapse) {
            let collapse = 0;
            thisBranch = random(angNum);
            
            for (let k = 0; k < notchNum; k++) {
                if (abs(thisBranch - notches[k]) < notchWidth) {
                    collapse++;
                }
            }
            
            if (collapse === 0) {
                thisBranchCollapse = false;
            }
        }
        
        branches.push(thisBranch);
    }
    
    // Random rotation offset
    const rotateAngle = random(2) * PI;
    
    // Main generation loop
    for (let i = 0; i < angNum; i++) {
        const angle = i * 0.005 + rotateAngle;
        
        // Calculate width variations using noise
        let widOut = 0.1 * noise(config.wreckleness * angle);
        let widIn = 0.1 * noise(config.wreckleness * angle * 2);
        let widAid = 0.1 * noise((config.wreckleness * angle) / 4);
        
        // End narrowing effect
        const endDistance = min(angNum - i, i);
        const approachingEnd_A = endDistance / angNum;
        const approachingEnd_B = min(pow(approachingEnd_A, 2), 1) * 2;
        const approachingEnd_C = noise(i * 0.01) / 3;
        
        widOut *= approachingEnd_C ** config.enclosingThickness * config.thickness;
        widIn *= approachingEnd_C ** config.enclosingThickness * config.thickness;
        widAid *= approachingEnd_C * config.thickness;
        
        // Apply notch effects
        let blank = 0;
        let gradualDecrease = 0;
        
        for (let j = 0; j < notches.length; j++) {
            // Check if within notch
            if (abs(i - notches[j]) < notchWidth) {
                blank++;
            }
            
            // Gradual decrease near notches
            if (abs(i - notches[j]) < notchWidth * 3 && abs(i - notches[j]) > notchWidth) {
                gradualDecrease++;
                const mapValue = map(abs(i - notches[j]), notchWidth * 3, 0, 1, -0.5);
                widOut *= mapValue;
                widIn *= mapValue;
            }
        }
        
        // Calculate ring points
        const radiusA = radius * (1 + widOut) * (1 + widAid);
        const radiusB = radius * (1 - widIn) * (1 + widAid);
        
        const pointA = createVector(cos(angle) * radiusA, sin(angle) * radiusA).add(center);
        const pointB = createVector(cos(angle) * radiusB, sin(angle) * radiusB).add(center);
        
        // Add line segment if not in a notch
        if (blank === 0) {
            arrayOfArrival.push([pointA, pointB]);
        }
        
        // Generate branches
        for (let j = 0; j < branches.length; j++) {
            if (i === floor(branches[j])) {
                generateBranch(
                    pointA, pointB, angle, 
                    widOut, widIn, 
                    arrayOfArrival
                );
            }
        }
    }
    
    return arrayOfArrival;
}

/**
 * Generate a single branch from the ring
 */
function generateBranch(pointA, pointB, angle, widOut, widIn, arrayOfArrival) {
    const config = RenderConfig;
    
    let branchLength = ((widOut + widIn) * config.branchLengthStandard) ** 3.1;
    
    // Determine branch direction
    let perpAngle;
    if (random(1) > 0.5) {
        angle += PI / 2;
    } else {
        angle -= PI / 2;
    }
    
    // Add curvature
    if (random(1) > 0.5) {
        perpAngle = angle + PI / config.branchCurveness;
    } else {
        perpAngle = angle - PI / config.branchCurveness;
    }
    
    // Generate branch segments
    for (let k = 0; k < floor(branchLength) + 5; k++) {
        const steering = randomGaussian(k / branchLength, config.branchGaussian);
        const beta = lerp(angle, perpAngle, steering);
        
        let adjustment;
        if (k < branchLength) {
            adjustment = createVector(cos(beta), sin(beta));
        } else {
            // Shrink at the end
            pointB.lerp(pointA, 0.9);
            adjustment = createVector(cos(beta), sin(beta));
        }
        
        pointA.add(adjustment.mult(0.7));
        pointB.add(adjustment.mult(0.3));
        
        const pointC = pointA.copy();
        const pointD = pointB.copy();
        
        arrayOfArrival.push([pointC, pointD]);
    }
}
