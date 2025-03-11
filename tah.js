// parents = ['.tah-list-groups', '#tah-groups'];
// chidren = ['.tah-tab-group', '.tah-list-group', '.tah-action'];

//close but not quite. need refining. Values 0-255 produce incorrect results. Thanks chatGPT
// const calculateOffset = (angle) => {
//     // Convert angle to radians
//     const angleRad = (angle * Math.PI) / 180;

//     // Calculate offset based on the radius of the inner circle
//     const radius = 150; // This should be the same radius used in the outer rotation

//     // Calculate offsets
//     const offsetX = radius * Math.cos(angleRad);
//     const offsetY = radius * Math.sin(angleRad);

//     return {
  //         X: offsetX,
  //         Y: offsetY
  //     };
  // }
  
const createRadialMenu = () => {
  const rotatingDivsInner = document.querySelectorAll('.tah-tab-group');
  const totalDivs = rotatingDivsInner.length;
  const radius = 150; // Radius of the inner circle
  
  function normalizeRotation(degrees) {
    return ((degrees % 360) + 360) % 360; // Normalize to 0-360 range
  }
  
  const snapRotation = (e) => {
    const div = e.target.closest('.tah-tab-group');
    const targetTransform = div.style.transform.match(/rotate\(([-\d.]+)deg\)/);
    const targetRotation = targetTransform ? parseFloat(targetTransform[1]) : 0;
    
    // Target angle to snap to
    const targetAngle = 316;
    
    // Calculate the difference between the current rotation and the target angle
    const rotationDifference = targetAngle - (targetRotation % 360);
    const snapRotationAmount = normalizeRotation(rotationDifference);
    
    rotatingDivsInner.forEach(div => {
      const currentTransform = div.style.transform.match(/rotate\(([-\d.]+)deg\)/);
      const currentRotation = currentTransform ? parseFloat(currentTransform[1]) : 0;
      const newRotation = normalizeRotation(currentRotation + snapRotationAmount);
  
      div.style.transform = `rotate(${newRotation}deg) translate(${radius}px) rotate(-${newRotation}deg)`;
    });
  }

  rotatingDivsInner.forEach((div, index) => {
    const angle = (index / totalDivs) * 360; // Calculate the angle for each div
    div.style.transform = `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`; 
    // Second rotation negates the first one to keep the divs upright

    const childButton = div.querySelector('.tah-group-button');
    childButton.addEventListener('click', snapRotation);
    childButton.addEventListener('touchstart', snapRotation);
  });

  const radiusTwo = 250; // Radius of the outer circles
  
  let startY, isDragging = false;
  
  const innerParent = document.querySelector('#tah-groups');
  
  innerParent.addEventListener('mousedown', startDrag);
  innerParent.addEventListener('touchstart', startDrag);
  innerParent.addEventListener('mousemove', rotateDivsInner);
  innerParent.addEventListener('touchmove', rotateDivsInner);
  innerParent.addEventListener('mouseup', endDrag);
  innerParent.addEventListener('touchend', endDrag);
  
  const outerParents = document.querySelectorAll('.tah-list-groups');
  
  outerParents.forEach(parent => {
    const rotatingDivsOuter = parent.querySelectorAll('.tah-action');
    const totalDivs = rotatingDivsOuter.length;

    rotatingDivsOuter.forEach((div, index) => {
      const angle = (index / totalDivs) * 360; // Calculate the angle for each div
      div.style.transform = `rotate(${angle}deg) translate(${radiusTwo}px) rotate(-${angle}deg)`; 
      // Second rotation negates the first one to keep the divs upright
    });

    parent.addEventListener('mousedown', startDrag);
    parent.addEventListener('touchstart', startDrag);
    parent.addEventListener('mousemove', rotateDivsOuter);
    parent.addEventListener('touchmove', rotateDivsOuter);
    parent.addEventListener('mouseup', endDrag);
    parent.addEventListener('touchend', endDrag);
  });

  function startDrag(e) {
      startY = e.pageY || e.touches[0].pageY;
      isDragging = true;
  }
  
  function rotateDivsInner(e) {
    if (!isDragging || e.target.id !== 'tah-groups') return;
    const currentY = e.pageY || e.touches[0].pageY;
    const deltaY = currentY - startY;
  
    const rotationDegree = deltaY * 0.4; // Adjust the factor to control the sensitivity
  
    rotatingDivsInner.forEach(div => {
      const currentTransform = div.style.transform.match(/rotate\(([-\d.]+)deg\)/);
      const currentRotation = currentTransform ? parseFloat(currentTransform[1]) : 0;
      const newRotation = normalizeRotation(currentRotation + rotationDegree);
  
      div.style.transform = `rotate(${newRotation}deg) translate(${radius}px) rotate(-${newRotation}deg)`;
      startY = currentY; // Update the startY for smoother continuous rotation
    });
  }

  function rotateDivsOuter(e) {
    if (!isDragging) return;
    const currentY = e.pageY || e.touches[0].pageY;
    const deltaY = currentY - startY;
    
    const rotationDegree = deltaY * 0.4; // Adjust the factor to control the sensitivity

    const rotatingDivsOuter = e.srcElement.querySelectorAll('.tah-action');
    
    rotatingDivsOuter.forEach(div => {
      const currentTransform = div.style.transform.match(/rotate\(([-\d.]+)deg\)/);
      const currentRotation = currentTransform ? parseFloat(currentTransform[1]) : 0;
      const newRotation = normalizeRotation(currentRotation + rotationDegree);
  
      div.style.transform = `rotate(${newRotation}deg) translate(${radiusTwo}px) rotate(-${newRotation}deg)`;
      startY = currentY; // Update the startY for smoother continuous rotation
    });
  } 

  function endDrag() {
      isDragging = false;
  }

}

Hooks.on("renderTokenActionHud", (hud, html, data) => {
    createRadialMenu();
});

// const rotatingDivs = document.querySelectorAll('.tah-tab-group');
// const totalDivs = rotatingDivs.length;
// const radius = 150; // Radius of the circle

// rotatingDivs.forEach((div, index) => {
//   const angle = (index / totalDivs) * 360; // Calculate the angle for each div
//   div.style.transform = `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`; 
//   // Second rotation negates the first one to keep the divs upright
// });

// let startY, isDragging = false;

// document.querySelector('#tah-groups').addEventListener('mousedown', startDrag);
// document.querySelector('#tah-groups').addEventListener('touchstart', startDrag);
// document.querySelector('#tah-groups').addEventListener('mousemove', rotateDivs);
// document.querySelector('#tah-groups').addEventListener('touchmove', rotateDivs);
// document.querySelector('#tah-groups').addEventListener('mouseup', endDrag);
// document.querySelector('#tah-groups').addEventListener('touchend', endDrag);

// function startDrag(e) {
//   startY = e.pageY || e.touches[0].pageY;
//   isDragging = true;
// }

// function normalizeRotation(degrees) {
//   return ((degrees % 360) + 360) % 360; // Normalize to 0-360 range
// }

// function rotateDivs(e) {
//   if (!isDragging) return;
//   const currentY = e.pageY || e.touches[0].pageY;
//   const deltaY = currentY - startY;

//   const rotationDegree = deltaY * 0.2; // Adjust the factor to control the sensitivity

//   rotatingDivs.forEach(div => {
//     const currentTransform = div.style.transform.match(/rotate\(([-\d.]+)deg\)/);
//     const currentRotation = currentTransform ? parseFloat(currentTransform[1]) : 0;
//     const newRotation = normalizeRotation(currentRotation + rotationDegree);

//     div.style.transform = `rotate(${newRotation}deg) translate(${radius}px) rotate(-${newRotation}deg)`;
//     // The second rotation keeps the divs upright as they move around the circle
//   });

//   startY = currentY; // Update the startY for smoother continuous rotation
// }

// function endDrag() {
//   isDragging = false;
// }

// const rotatingDivsTwo = document.querySelector('.tah-tab-group.hover').querySelectorAll(".tah-action");
// const totalDivsTwo = rotatingDivsTwo.length;
// const radiusTwo = 250; // RadiusTwo of the circle

// rotatingDivsTwo.forEach((div, index) => {
//   const angle = (index / totalDivsTwo) * 360; // Calculate the angle for each div
//   div.style.transform = `rotate(${angle}deg) translate(${radiusTwo}px) rotate(-${angle}deg)`; 
//   // Second rotation negates the first one to keep the divs upright
// });

// let startY, isDragging = false;

// document.querySelector('.tah-actions').addEventListener('mousedown', startDrag);
// document.querySelector('.tah-actions').addEventListener('touchstart', startDrag);
// document.querySelector('.tah-actions').addEventListener('mousemove', rotateDivs);
// document.querySelector('.tah-actions').addEventListener('touchmove', rotateDivs);
// document.querySelector('.tah-actions').addEventListener('mouseup', endDrag);
// document.querySelector('.tah-actions').addEventListener('touchend', endDrag);

// function startDrag(e) {
//   startY = e.pageY || e.touches[0].pageY;
//   isDragging = true;
// }

// function normalizeRotation(degrees) {
//   return ((degrees % 360) + 360) % 360; // Normalize to 0-360 range
// }

// function rotateDivs(e) {
//   if (!isDragging) return;
//   const currentY = e.pageY || e.touches[0].pageY;
//   const deltaY = currentY - startY;

//   const rotationDegree = deltaY * 0.2; // Adjust the factor to control the sensitivity

//   rotatingDivsTwo.forEach(div => {
//     const currentTransform = div.style.transform.match(/rotate\(([-\d.]+)deg\)/);
//     const currentRotation = currentTransform ? parseFloat(currentTransform[1]) : 0;
//     const newRotation = normalizeRotation(currentRotation + rotationDegree);

//     div.style.transform = `rotate(${newRotation}deg) translate(${radiusTwo}px) rotate(-${newRotation}deg)`;
//     // The second rotation keeps the divs upright as they move around the circle
//   });

//   startY = currentY; // Update the startY for smoother continuous rotation
// }

// function endDrag() {
//   isDragging = false;
// }
