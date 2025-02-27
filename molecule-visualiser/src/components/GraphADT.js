export class atomNode {
  constructor(atomName, hybridisation, atomSymbol) {
    this.atomName = atomName;
    this.hybridisation = hybridisation;
    this.atomSymbol = atomSymbol;
    this.coordinates = [0, 0, 0];
    this.connections = [];
  }
}

export class Molecule {
  constructor() {
    this.adjacencyList = {};
    this.atomList = [];
  }

  getNeighbours(atom) {
  if (atom && this.adjacencyList[atom.atomName]) {
    return this.adjacencyList[atom.atomName].map(({ atomName }) =>
      this.atomList.find((a) => a.atomName === atomName)
    );
  }
  return [];
}


  addAtoms(atom) {
    if (!this.adjacencyList[atom.atomName]) {
      this.adjacencyList[atom.atomName] = [];
      this.atomList.push(atom);
    } else {
    }
  }

  addBond(atom1, atom2, isSingleBond = false, isDoubleBond = false, isTripleBond = false) {
    if (
      this.adjacencyList[atom1.atomName] &&
      this.adjacencyList[atom2.atomName]
    ) {
      let flag1 = 0;
      for (let i = 0; i < this.adjacencyList[atom1.atomName].length; i++) {
        if (this.adjacencyList[atom1.atomName][i].atomName === atom2.atomName) {
          flag1 = 1;
          break;
        }
      }
      if (!flag1) {
        this.adjacencyList[atom1.atomName].push({
          atomName: atom2.atomName,
          isSingleBond: isSingleBond && !isDoubleBond && !isTripleBond,
          isDoubleBond: !isSingleBond && isDoubleBond && !isTripleBond,
          isTripleBond: !isSingleBond && !isDoubleBond && isTripleBond
        });
      }
  
      let flag2 = 0;
      for (let i = 0; i < this.adjacencyList[atom2.atomName].length; i++) {
        if (this.adjacencyList[atom2.atomName][i].atomName === atom1.atomName) {
          flag2 = 1;
          break;
        }
      }
      if (!flag2) {
        this.adjacencyList[atom2.atomName].push({
          atomName: atom1.atomName,
          isSingleBond: isSingleBond && !isDoubleBond && !isTripleBond,
          isDoubleBond: !isSingleBond && isDoubleBond && !isTripleBond,
          isTripleBond: !isSingleBond && !isDoubleBond && isTripleBond
        });
      }
    }
  }
  
}
