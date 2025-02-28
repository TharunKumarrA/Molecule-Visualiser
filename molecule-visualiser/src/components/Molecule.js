import { Molecule, atomNode } from "./GraphADT.js";

export function createAtomNode(atomName, hybridisation, atomSymbol) {
  return new atomNode(atomName, hybridisation, atomSymbol);
}

export function addAtoms(molecule, atom) {
  molecule.addAtoms(atom);
}

export function addBonds(molecule, atom1Name, atom2Name, isSingleBond, isDoubleBond, isTripleBond) {
  const atom1 = molecule.atomList.find((atom) => atom.atomName === atom1Name);
  const atom2 = molecule.atomList.find((atom) => atom.atomName === atom2Name);

  if (atom1 && atom2) {
    molecule.addBond(atom1, atom2, isSingleBond, isDoubleBond, isTripleBond);
  } else {
    console.log("One or both atoms not found in molecule.");
  }
}

export function findCentralAtoms(molecule) {
  let centralAtoms = [];
  let maxHybridisation = "";

  // Find the maximum hybridisation
  for (let atom of molecule.atomList) {
    if (atom.hybridisation > maxHybridisation) {
      maxHybridisation = atom.hybridisation;
    }
  }

  // Find atoms with maximum hybridisation
  for (let atom of molecule.atomList) {
    if (atom.hybridisation === maxHybridisation) {
      centralAtoms.push(atom);
    }
  }
  return centralAtoms;
}

// Calculate Coordiantes of the atoms in 3D Plane.
export function getCoordinates(molecule) {
  molecule.atomList.forEach(atom => {
      atom.bondsAssignedCount = 0;
  });

  // Constant Angles defined for respective hybridisations.
  const angles = {
    sp: { angleX: Math.PI, angleY: 0, angleZ: 0 },
    sp2: { angleX: -Math.PI / 6, angleY: Math.PI / 3, angleZ: 0 },
    sp3: {
      angleX: 0.615 * Math.PI,
      angleY: 0.955 * Math.PI,
      angleZ: 0.615 * Math.PI,
    },
    sp3d: {
      angleX: Math.PI / 2,
      angleY: Math.PI / 2,
      angleZ: Math.PI / 2,
    },
    sp3d2: { 
      angleX: Math.PI / 2,
      angleY: Math.PI / 2, 
      angleZ: Math.PI / 2 
    }
  };

  // Get Central Atoms of the Molecule.
  const centralAtoms = findCentralAtoms(molecule);
  let visited = [];
  let centralVisited = [];
  for (let atom of centralAtoms) {
    centralVisited[atom] = false;
  }
  let queue = [];
  let initialAtom = centralAtoms[0];
  queue.push([initialAtom, null]);
  visited.push(initialAtom);
  let directionVectorStack = [];

  while (queue.length) {
    let [currentAtom, parentAtom] = queue.shift();
    let neighbours = molecule.getNeighbours(currentAtom);
    if (currentAtom) {
      if (parentAtom === null) {
        // Set coordinates for the first atom
        currentAtom.coordinates = [0, 0, 0];
        directionVectorStack.push([1, 0, 0]);
      } else {
        let initalDirection = directionVectorStack[directionVectorStack.length - 1];
        console.log("Initial Direction: ", initalDirection);
        let parentCoordinates = parentAtom.coordinates;
        let angleX, angleY, angleZ;
        let bondlength = 1;
        let newDirection = [];

        angleX = angles[parentAtom.hybridisation].angleX;
        angleY = angles[parentAtom.hybridisation].angleY;
        angleZ = angles[parentAtom.hybridisation].angleZ;

        if (parentAtom.hybridisation === "sp") {
          newDirection = [
            -initalDirection[0],
            initalDirection[1],
            initalDirection[2],
          ];
          directionVectorStack.push(newDirection);

          let newCoordinates = [
            parentCoordinates[0] + bondlength * newDirection[0],
            parentCoordinates[1] + bondlength * newDirection[1],
            parentCoordinates[2] + bondlength * newDirection[2],
          ];
          currentAtom.coordinates = newCoordinates;
          console.log("New Direction for atom: ", currentAtom, newDirection);
        } else if (parentAtom.hybridisation === "sp3d") {
          const allNeighbors = molecule.getNeighbours(parentAtom);
          const connectionIndex = allNeighbors.findIndex(
            atom => atom.atomName === currentAtom.atomName
          );
          
          if (connectionIndex !== -1) {
            const newCoordinates = calculateSp3dCoordinates(
              parentCoordinates,
              connectionIndex,
              allNeighbors.length,
              1
            );
            
            currentAtom.coordinates = newCoordinates;
            
            const newDirection = [
              newCoordinates[0] - parentCoordinates[0],
              newCoordinates[1] - parentCoordinates[1],
              newCoordinates[2] - parentCoordinates[2]
            ];
            
            const magnitude = Math.sqrt(
              newDirection[0] * newDirection[0] + 
              newDirection[1] * newDirection[1] + 
              newDirection[2] * newDirection[2]
            );
            
            if (magnitude > 0) {
              newDirection[0] /= magnitude;
              newDirection[1] /= magnitude;
              newDirection[2] /= magnitude;
            }
            
            directionVectorStack.push(newDirection);
          }
        } else if (parentAtom.hybridisation === "sp3d2") {
          const octahedralCoords = generateOctahedralCoordinates(parentCoordinates);
  
          if (typeof parentAtom.bondsAssignedCount === "undefined") {
            parentAtom.bondsAssignedCount = 0;
          }
          
          let positionIndex = parentAtom.bondsAssignedCount;
          if (positionIndex >= octahedralCoords.length) {
            positionIndex = octahedralCoords.length - 1;
          }
          
          parentAtom.bondsAssignedCount += 1;
          currentAtom.coordinates = octahedralCoords[positionIndex];
          
          newDirection = [
            octahedralCoords[positionIndex][0] - parentCoordinates[0],
            octahedralCoords[positionIndex][1] - parentCoordinates[1],
            octahedralCoords[positionIndex][2] - parentCoordinates[2],
          ];
          
          directionVectorStack.push(newDirection);
        } else {
          if (
            (initalDirection[0] === 1 &&
              initalDirection[1] === 0 &&
              initalDirection[2] === 0) ||
            directionVectorStack.length === 1
          ) {
            newDirection = [
              initalDirection[0] * (Math.cos(angleY) * Math.cos(angleZ)) +
                initalDirection[1] * (Math.cos(angleY) * Math.sin(angleZ)) -
                initalDirection[2] * Math.sin(angleY),
              initalDirection[0] *
                (-Math.cos(angleX) * Math.sin(angleZ) +
                  Math.sin(angleX) * Math.sin(angleY) * Math.cos(angleZ)) +
                initalDirection[1] *
                  (Math.cos(angleX) * Math.cos(angleZ) +
                    Math.sin(angleX) * Math.sin(angleY) * Math.sin(angleZ)) +
                initalDirection[2] * (Math.sin(angleX) * Math.cos(angleY)),
              initalDirection[0] *
                (Math.sin(angleX) * Math.sin(angleZ) +
                  Math.cos(angleX) * Math.sin(angleY) * Math.cos(angleZ)) +
                initalDirection[1] *
                  (-Math.sin(angleX) * Math.cos(angleZ) +
                    Math.cos(angleX) * Math.sin(angleY) * Math.sin(angleZ)) +
                initalDirection[2] * (Math.cos(angleX) * Math.cos(angleY)),
            ];

            if (
              parentAtom.hybridisation === "sp2" &&
              currentAtom.atomSymbol === "C"
            ) {
              newDirection = rotateVectorAroundXYPlane(initalDirection, -120);
            } else if (
              parentAtom.hybridisation === "sp2" &&
              currentAtom.atomSymbol === "H"
            ) {
              newDirection = rotateVectorAroundXYPlane(initalDirection, 120);
            }
            if (
              initalDirection[0] === 1 &&
              initalDirection[1] === 0 &&
              initalDirection[2] === 0
            )
              directionVectorStack.pop();
            directionVectorStack.push(newDirection);

            let newCoordinates = [
              parentCoordinates[0] + bondlength * newDirection[0],
              parentCoordinates[1] + bondlength * newDirection[1],
              parentCoordinates[2] + bondlength * newDirection[2],
            ];
            currentAtom.coordinates = newCoordinates;
            console.log("New Direction for atom: ", currentAtom, newDirection);
          } else if (directionVectorStack.length === 2) {
            console.log("Came Here for Atom: ", currentAtom);
            let firstCoordinate =
              directionVectorStack[directionVectorStack.length - 1];
            let secondCoordinate =
              directionVectorStack[directionVectorStack.length - 2];

            console.log("First Coordinate:", firstCoordinate);
            console.log("Second Coordinate:", secondCoordinate);

            if (parentAtom.hybridisation === "sp2")
              newDirection = calculateVector120DegreesOnPlane(
                firstCoordinate,
                secondCoordinate,
                120
              );
            if (parentAtom.hybridisation === "sp3")
              newDirection = findThirdCoordinate(
                firstCoordinate,
                secondCoordinate
              );
            directionVectorStack.push(newDirection);

            console.log("New Direction:", newDirection);

            // Calculate new coordinates
            let newCoordinates = [
              parentCoordinates[0] + bondlength * newDirection[0],
              parentCoordinates[1] + bondlength * newDirection[1],
              parentCoordinates[2] + bondlength * newDirection[2],
            ];
            console.log("New Coordinates:", newCoordinates);
            currentAtom.coordinates = newCoordinates;
          } else if (directionVectorStack.length === 3) {
            console.log("Came to 3 for atom: ", currentAtom);
            let firstCoordinate =
              directionVectorStack[directionVectorStack.length - 1];
            let secondCoordinate =
              directionVectorStack[directionVectorStack.length - 2];
            let thirdCoordinate =
              directionVectorStack[directionVectorStack.length - 3];

            newDirection = findFourthCoordinate(
              firstCoordinate,
              secondCoordinate,
              thirdCoordinate
            );
            directionVectorStack.push(newDirection);

            console.log("New Direction: ", newDirection);

            let newCoordinates = [
              parentCoordinates[0] + bondlength * newDirection[0],
              parentCoordinates[1] + bondlength * newDirection[1],
              parentCoordinates[2] + bondlength * newDirection[2],
            ];
            console.log("New Coordinates:", newCoordinates);
            currentAtom.coordinates = newCoordinates;
          }
        }
      }

      // Pushes all neighbours of the currentatom to the queue.
      let pushedCentral = false;
      for (let neighbour of neighbours) {
        if (!visited.includes(neighbour)) {
          if (centralAtoms.includes(neighbour)) {
            if (!pushedCentral) {
              queue.push([neighbour, currentAtom]);
              visited.push(neighbour);
            }
          } else {
            queue.push([neighbour, currentAtom]);
            visited.push(neighbour);
          }
          if (centralAtoms.includes(neighbour)) pushedCentral = true;
        }
      }

      // Alkene Part - Yet has some logic to be implemented
      if (
        !centralAtoms.includes(currentAtom) &&
        currentAtom.atomSymbol !== "H"
      ) {
        if (
          checkCentralVisited(centralVisited, centralAtoms) &&
          checkVisited(visited, molecule)
        ) {
          let secondMaxHybrid = "";
          for (let atom of molecule.atomList) {
            if (
              atom.hybridisation > secondMaxHybrid &&
              atom.hybridisation < centralAtoms[0].hybridisation
            ) {
              secondMaxHybrid = atom.hybridisation;
            }
          }
          console.log("New MAX Hybridisation: ", secondMaxHybrid);
          for (let atom of molecule.atomList) {
            if (atom.hybridisation === secondMaxHybrid) {
              centralAtoms.push(atom);
            }
          }
        }
      }

      // Updating the stack to be empty if current atom is a central atom
      if (centralAtoms.includes(currentAtom) && parentAtom !== null) {
        centralVisited[currentAtom] = true;
        let temp = directionVectorStack[directionVectorStack.length - 1];
        directionVectorStack = [];
        directionVectorStack.push(temp);
      }

      // Setting the connections property for the current atom
      currentAtom.connections = neighbours;
    }
    console.log("New Central Atoms: ", centralAtoms);
  }
}

function isAxialPosition(index, totalConnections) {
  return index === 0 || index === totalConnections - 1;
}

function calculateSp3dCoordinates(parentCoordinates, connectionIndex, totalConnections, bondLength = 1) {
  if (isAxialPosition(connectionIndex, totalConnections)) {
    const zDirection = connectionIndex === 0 ? 1 : -1;
    return [
      parentCoordinates[0],
      parentCoordinates[1],
      parentCoordinates[2] + (zDirection * bondLength)
    ];
  } else {
    const equatorialIndex = connectionIndex - 1;
    const angle = (2 * Math.PI / 3) * equatorialIndex;
    
    return [
      parentCoordinates[0] + bondLength * Math.cos(angle),
      parentCoordinates[1] + bondLength * Math.sin(angle),
      parentCoordinates[2]
    ];
  }
}

function generateOctahedralCoordinates(parentCoordinates, bondLength = 1) {
  const directions = [
    [1, 0, 0],   
    [-1, 0, 0],  
    [0, 1, 0],   
    [0, -1, 0],  
    [0, 0, 1],  
    [0, 0, -1]  
  ];
  
  return directions.map(dir => [
    parentCoordinates[0] + bondLength * dir[0],
    parentCoordinates[1] + bondLength * dir[1],
    parentCoordinates[2] + bondLength * dir[2]
  ]);
}


// Returns true if central atoms list doesnt have any atom yet to be visited.
function checkCentralVisited(centralVisited, centralAtoms) {
  for (let atom of centralAtoms) {
    if (!centralVisited.includes(atom)) return true;
  }
  return false;
}

// Returns true if any of the atom is still yet to be visited.
function checkVisited(visited, molecule) {
  for (let atom of molecule.atomList) {
    if (!visited.includes(atom)) return true;
  }
  return false;
}

export function drawMolecule(molecule) {}

// Helper function to calculate the vector sum
function vectorSum(v1, v2) {
  return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
}

// Helper function to calculate the magnitude of a vector
function magnitude(v) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}

// Helper function to normalize a vector
function normalize(v) {
  const mag = magnitude(v);
  if (mag === 0) {
    return [0, 0, 0]; 
  }
  return [v[0] / mag, v[1] / mag, v[2] / mag];
}

// Helper function to calculate the cross product of two vectors
function crossProduct(v1, v2) {
  return [
    v1[1] * v2[2] - v1[2] * v2[1],
    v1[2] * v2[0] - v1[0] * v2[2],
    v1[0] * v2[1] - v1[1] * v2[0],
  ];
}

// Helper function to calculate the vector that is 120 degrees from the two given vectors and lies on the same plane
function calculateVector120DegreesOnPlane(
  firstCoordinate,
  secondCoordinate,
  a
) {
  const normal = crossProduct(firstCoordinate, secondCoordinate); // Calculate the normal vector to the plane formed by the two input vectors
  const normalizedNormal = normalize(normal); // Normalize the normal vector
  const projectedFirst = [
    firstCoordinate[0] - firstCoordinate[0] * normalizedNormal[0],
    firstCoordinate[1] - firstCoordinate[1] * normalizedNormal[1],
    firstCoordinate[2] - firstCoordinate[2] * normalizedNormal[2],
  ]; // Project the first vector onto the plane
  const projectedSecond = [
    secondCoordinate[0] - secondCoordinate[0] * normalizedNormal[0],
    secondCoordinate[1] - secondCoordinate[1] * normalizedNormal[1],
    secondCoordinate[2] - secondCoordinate[2] * normalizedNormal[2],
  ]; // Project the second vector onto the plane
  const sumVector = vectorSum(projectedFirst, projectedSecond); // Calculate the vector sum of the projected vectors
  const normalizedSumVector = normalize(sumVector); // Normalize the vector sum
  const angle = (a * Math.PI) / 180; // Convert 120 degrees to radians
  const rotationMatrix = [
    [Math.cos(angle), 0, Math.sin(angle)],
    [0, 1, 0],
    [-Math.sin(angle), 0, Math.cos(angle)],
  ]; // Create a rotation matrix for rotating around the Z-axis by 120 degrees
  const vector120Degrees = [
    rotationMatrix[0][0] * normalizedSumVector[0] +
      rotationMatrix[0][1] * normalizedSumVector[1] +
      rotationMatrix[0][2] * normalizedSumVector[2],
    rotationMatrix[1][0] * normalizedSumVector[0] +
      rotationMatrix[1][1] * normalizedSumVector[1] +
      rotationMatrix[1][2] * normalizedSumVector[2],
    rotationMatrix[2][0] * normalizedSumVector[0] +
      rotationMatrix[2][1] * normalizedSumVector[1] +
      rotationMatrix[2][2] * normalizedSumVector[2],
  ]; // Rotate the normalized vector sum by 120 degrees using the rotation matrix
  return vector120Degrees;
}

function findThirdCoordinate(v1, v2) {
  const norm1 = normalize(v1);
  const norm2 = normalize(v2);

  const perpendicular = normalize(crossProduct(norm1, norm2));
  const tetrahedralAngle = 109.5 * (Math.PI / 180);

  const dotProduct = norm1[0] * norm2[0] + norm1[1] * norm2[1] + norm1[2] * norm2[2];

  const existingAngle = Math.acos(dotProduct);
  const rotationAngle = (tetrahedralAngle - existingAngle) / 2;
  const rotationAxis = perpendicular;
  
  const c = Math.cos(rotationAngle);
  const s = Math.sin(rotationAngle);
  const t = 1 - c;
  const x = rotationAxis[0];
  const y = rotationAxis[1];
  const z = rotationAxis[2];
  
  const rotatedVector = [
    (t * x * x + c) * norm1[0] + (t * x * y - s * z) * norm1[1] + (t * x * z + s * y) * norm1[2],
    (t * x * y + s * z) * norm1[0] + (t * y * y + c) * norm1[1] + (t * y * z - s * x) * norm1[2],
    (t * x * z - s * y) * norm1[0] + (t * y * z + s * x) * norm1[1] + (t * z * z + c) * norm1[2]
  ];
  
  const thirdVector = normalize([
    rotatedVector[0] + perpendicular[0] * Math.sin(tetrahedralAngle),
    rotatedVector[1] + perpendicular[1] * Math.sin(tetrahedralAngle),
    rotatedVector[2] + perpendicular[2] * Math.sin(tetrahedralAngle)
  ]);
  
  return thirdVector;
}

function findFourthCoordinate(v1, v2, v3) {
  const norm1 = normalize(v1);
  const norm2 = normalize(v2);
  const norm3 = normalize(v3);
  
  const sum = [
    norm1[0] + norm2[0] + norm3[0],
    norm1[1] + norm2[1] + norm3[1],
    norm1[2] + norm2[2] + norm3[2]
  ];
  
  const fourthVector = normalize([-sum[0], -sum[1], -sum[2]]);
  
  return fourthVector;
}

function rotateVectorAroundXYPlane(vector, angleInDegrees) {
  const [x, y, z] = vector;
  const angleInRadians = (angleInDegrees * Math.PI) / 180;
  const rotatedX = x * Math.cos(angleInRadians) - z * Math.sin(angleInRadians);
  const rotatedY = y;
  const rotatedZ = x * Math.sin(angleInRadians) + z * Math.cos(angleInRadians);
  return [rotatedX, rotatedY, rotatedZ];
}

function CalcThirdCoordinate(coord1, coord2, angle1, angle2) {
  // Convert angles to radians
  angle1 = (angle1 * Math.PI) / 180;
  angle2 = (angle2 * Math.PI) / 180;

  // Calculate the direction vectors
  const dir1 = [Math.cos(angle1), Math.sin(angle1), 0];
  const dir2 = [Math.cos(angle2), Math.sin(angle2), 0];

  // Calculate the coefficients for the system of linear equations
  const a11 = dir1[0];
  const a12 = dir2[0];
  const a21 = dir1[1];
  const a22 = dir2[1];
  const b1 = coord1[0] - coord2[0];
  const b2 = coord1[1] - coord2[1];

  // Solve the system of linear equations
  const det = a11 * a22 - a12 * a21;
  const x = (b1 * a22 - b2 * a12) / det;
  const y = (a11 * b2 - a21 * b1) / det;

  // Return the third coordinate
  return [x + coord2[0], y + coord2[1], coord2[2]];
}
