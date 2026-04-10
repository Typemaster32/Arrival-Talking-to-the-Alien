// Collection display rendering

/**
 * Display collected conversation graphics
 * 
 * @param {Object} collectionState - CollectionState object
 * @param {number} radius - Ring radius for positioning
 */
function displayCollection(collectionState, radius) {
    const { 
        items, 
        marksAlien, 
        marksHuman, 
        graphicsIndex, 
        projectWidth, 
        projectHeight, 
        projectOffset, 
        rowNum, 
        colNum,
        centralOffset,
        proportionCollection
    } = collectionState;
    
    const maxHW = max(windowWidth, windowHeight);
    const minHW = min(windowWidth, windowHeight);
    const proportionScreen = maxHW / minHW;
    
    const markWidth = (projectWidth - 2 * projectOffset * 1.38);
    
    for (let i = 0; i < graphicsIndex; i++) {
        // Calculate grid position
        let pX = floor(i / rowNum);
        let pY = i % rowNum;
        
        pX *= (projectWidth - projectOffset * 2);
        pX -= projectOffset;
        
        // Offset for second column group
        if (i > 7) {
            pX += (projectWidth - projectOffset * 2) * 2.62;
        }
        
        pY *= projectHeight;
        
        const cX = pX + projectWidth / 2;
        const cY = pY + projectHeight / 2;
        
        push();
        
        // Draw the collection image
        image(items[i], pX, pY, projectWidth, projectWidth / proportionScreen);
        
        // Position alien mark
        marksAlien[i].show();
        marksAlien[i].style('text-align', 'center');
        marksAlien[i].style('font-size', '18px');
        marksAlien[i].style('left', '50%');
        marksAlien[i].style('top', '50%');
        marksAlien[i].style('transform', 'translate(-50%, -50%)');
        marksAlien[i].style('width', markWidth + 'px');
        marksAlien[i].style('word-wrap', 'break-word');
        marksAlien[i].style('font-family', 'Arial');
        marksAlien[i].style('font-style', 'italic');
        marksAlien[i].position(cX, cY + (radius / proportionCollection) * 1.14);
        
        // Position human mark
        marksHuman[i].show();
        marksHuman[i].style('text-align', 'center');
        marksHuman[i].style('font-size', '18px');
        marksHuman[i].style('left', '50%');
        marksHuman[i].style('top', '50%');
        marksHuman[i].style('transform', 'translate(-50%, -25%)');
        marksHuman[i].style('width', markWidth + 'px');
        marksHuman[i].style('word-wrap', 'break-word');
        marksHuman[i].position(cX, cY - (radius / proportionCollection) * 1.64);
        
        pop();
    }
}

/**
 * Collect current animation to collection
 * 
 * @param {Object} collectionState - CollectionState object
 * @param {Array} aoa - Array of arrival lines
 * @param {string} alienAnswer - Alien answer text
 * @param {string} humanQuestion - Human question text
 */
function collectToCollection(collectionState, aoa, alienAnswer, humanQuestion) {
    if (collectionState.graphicsIndex >= collectionState.projectMax) return;
    
    collectionState.setCurrentData(alienAnswer, humanQuestion);
    collectionState.collect(aoa, collectionState.projectWidth * collectionState.proportionCollection / 4);
}
