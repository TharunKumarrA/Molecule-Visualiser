import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import {
  createAtomNode,
  addAtoms,
  addBonds,
  buildMolecule,
  getCoordinates,
} from "../components/Molecule";
import { Molecule } from "../components/GraphADT";
import NavBar from "../components/Navbar";
import EditMolecule from "../components/EditMolecule";
import AISection from "../components/AISection";
import { checkCycle } from "../components/CheckCycle";

const MoleculeVisualizer = () => {
  const [atomsList, setAtomsList] = useState([]);
  const [molecule, setMolecule] = useState(new Molecule());
  const [trigger, setTrigger] = useState(0);
  const [resetAI, setResetAI] = useState(false);

  const [atomCounters, setAtomCounters] = useState({
    C: 0,
    H: 0,
    O: 0,
    N: 0,
    P: 0,
    S: 0,
    F: 0,
    Cl: 0,
  });

  const [compoundFormula, setCompoundFormula] = useState("");

  const generateCompoundFormula = () => {
    let formula = "";
    for (const [atom, count] of Object.entries(atomCounters)) {
      if (count > 0) {
        formula += atom;
        if (count > 1) {
          formula += count;
        }
      }
    }
    return formula;
  };

  useEffect(() => {
    const newCompoundFormula = generateCompoundFormula();
    setCompoundFormula(newCompoundFormula);
    console.log("Compound Formula: ", newCompoundFormula);
  }, [atomCounters]);

  useEffect(() => {
    getCoordinates(molecule);
    console.log("In useEffect");
  }, [trigger, molecule]);

  const incrementAtomCounter = (atomType) => {
    setAtomCounters((prevCounters) => ({
      ...prevCounters,
      [atomType]: prevCounters[atomType] + 1,
    }));
  };

  const handleDataFromEditMolecule = (data) => {
    if (data.type === "atom") {
      const atomCounter = atomCounters[data.atomSymbol];
      const atomName = data.atomSymbol + atomCounter;
      const atom = createAtomNode(
        atomName,
        data.hybridisation,
        data.atomSymbol
      );
      addAtoms(molecule, atom);
      console.log("Atom added: ", atom.atomName);
      console.log(data);
      incrementAtomCounter(data.atomSymbol);
    } else if (data.type === "bond") {
      addBonds(
        molecule,
        data.atom1Name,
        data.atom2Name,
        data.isSingleBond,
        data.isDoubleBond,
        data.isTripleBond
      );
      console.log("Bond added between: ", data.atom1Name, data.atom2Name);
      console.log(data);
    } else if (data.type === "clear") {
      // Reset all states when clearing the molecule
      setMolecule(new Molecule());
      setAtomsList([]);
      setAtomCounters({
        C: 0,
        H: 0,
        O: 0,
        N: 0,
        P: 0,
        S: 0,
        F: 0,
        Cl: 0,
      });
      setCompoundFormula("");
      setTrigger(0); // Reset trigger state
      setResetAI(true);
      setTimeout(() => setResetAI(false), 100);
    }

    setTrigger((prev) => prev + 1);
  };

  const handleMoleculeUpdate = (updatedMolecule) => {
    // When molecule is updated (especially cleared), set resetAI to true
    if (updatedMolecule.atomList.length === 0) {
      setResetAI(true);
      setTimeout(() => setResetAI(false), 100);
    }

    setMolecule(updatedMolecule);
    setTrigger(!trigger);
  };

  const traceAtoms = {
    type: "scatter3d",
    mode: "markers+text",
    text: molecule.atomList.map((atom) => atom.atomSymbol),
    x: molecule.atomList.map((atom) => atom.coordinates[0]),
    y: molecule.atomList.map((atom) => atom.coordinates[1]),
    z: molecule.atomList.map((atom) => atom.coordinates[2]),
    marker: {
      size: 12,
      opacity: 0.8,
      color: molecule.atomList.map((atom) => {
        switch (atom.atomSymbol) {
          case "C":
            return "black";
          case "H":
            return "#87CEEB"; // Medium Light Blue
          case "P":
            return "#FFA500"; // Orange
          case "Cl":
            return "#20B2AA"; // Light Sea Green
          case "S":
            return "yellow";
          case "F":
            return "#32CD32";
          default:
            return "#CD5C5C"; // Indian Red
        }
      }),
    },
  };

  const traceSingleBonds = {
    type: "scatter3d",
    mode: "lines",
    line: {
      color: "gray",
      width: 2,
    },
    x: [],
    y: [],
    z: [],
  };

  const traceDoubleBonds = {
    type: "scatter3d",
    mode: "lines",
    line: {
      color: "red",
      width: 4,
    },
    x: [],
    y: [],
    z: [],
  };

  const traceTripleBonds = {
    type: "scatter3d",
    mode: "lines",
    line: {
      color: "black",
      width: 4,
    },
    x: [],
    y: [],
    z: [],
  };

  // Add connections data to traceSingleBonds, traceDoubleBonds, and traceTripleBonds
  molecule.atomList.forEach((atom) => {
    const atomConnections = molecule.adjacencyList[atom.atomName];
    if (atomConnections) {
      atomConnections.forEach((connection) => {
        const connectedAtom = molecule.atomList.find(
          (a) => a.atomName === connection.atomName
        );

        if (connectedAtom) {
          if (connection.isDoubleBond) {
            // Main line
            traceDoubleBonds.x.push(
              atom.coordinates[0],
              connectedAtom.coordinates[0],
              null
            );
            traceDoubleBonds.y.push(
              atom.coordinates[1],
              connectedAtom.coordinates[1],
              null
            );
            traceDoubleBonds.z.push(
              atom.coordinates[2],
              connectedAtom.coordinates[2],
              null
            );

            // Offset line
            traceDoubleBonds.x.push(
              atom.coordinates[0] + 0.01,
              connectedAtom.coordinates[0] + 0.01,
              null
            );
            traceDoubleBonds.y.push(
              atom.coordinates[1],
              connectedAtom.coordinates[1],
              null
            );
            traceDoubleBonds.z.push(
              atom.coordinates[2] + 0.01,
              connectedAtom.coordinates[2],
              null
            );
          } else if (connection.isSingleBond && !connection.isTripleBond) {
            traceSingleBonds.x.push(
              atom.coordinates[0],
              connectedAtom.coordinates[0],
              null
            );
            traceSingleBonds.y.push(
              atom.coordinates[1],
              connectedAtom.coordinates[1],
              null
            );
            traceSingleBonds.z.push(
              atom.coordinates[2],
              connectedAtom.coordinates[2],
              null
            );
          } else if (connection.isTripleBond) {
            // Main line
            traceTripleBonds.x.push(
              atom.coordinates[0],
              connectedAtom.coordinates[0],
              null
            );
            traceTripleBonds.y.push(
              atom.coordinates[1],
              connectedAtom.coordinates[1],
              null
            );
            traceTripleBonds.z.push(
              atom.coordinates[2],
              connectedAtom.coordinates[2],
              null
            );

            // Offset lines
            traceTripleBonds.x.push(
              atom.coordinates[0] + 0.01,
              connectedAtom.coordinates[0] + 0.01,
              null
            );
            traceTripleBonds.y.push(
              atom.coordinates[1] + 0.01,
              connectedAtom.coordinates[1] + 0.01,
              null
            );
            traceTripleBonds.z.push(
              atom.coordinates[2] + 0.01,
              connectedAtom.coordinates[2] + 0.01,
              null
            );

            traceTripleBonds.x.push(
              atom.coordinates[0] - 0.01,
              connectedAtom.coordinates[0] - 0.01,
              null
            );
            traceTripleBonds.y.push(
              atom.coordinates[1] - 0.01,
              connectedAtom.coordinates[1] - 0.01,
              null
            );
            traceTripleBonds.z.push(
              atom.coordinates[2] - 0.01,
              connectedAtom.coordinates[2] - 0.01,
              null
            );
          }
        }
      });
    }
  });

  const layout = {
    margin: { l: 0, r: 0, b: 0, t: 0 },
    paper_bgcolor: "#1e1e1e", // Dark background for the plot
    plot_bgcolor: "#1e1e1e", // Dark background for the plot
    font: {
      color: "#ffffff", // White font color for better contrast
    },
    scene: {
      xaxis: {
        backgroundcolor: "#1e1e1e",
        gridcolor: "#444444",
        showbackground: true,
        zerolinecolor: "#444444",
      },
      yaxis: {
        backgroundcolor: "#1e1e1e",
        gridcolor: "#444444",
        showbackground: true,
        zerolinecolor: "#444444",
      },
      zaxis: {
        backgroundcolor: "#1e1e1e",
        gridcolor: "#444444",
        showbackground: true,
        zerolinecolor: "#444444",
      },
      annotations:
        molecule.atomList.length === 0
          ? [
              {
                text: "Add atoms and bonds using the menu on the right.",
                showarrow: false,
                x: 0,
                y: 0,
                z: 0,
                font: { size: 20, color: "#ffffff" },
              },
            ]
          : [],
    },
  };

  const atomMenuItems = [
    { value: "C", label: "C" },
    { value: "H", label: "H" },
    { value: "O", label: "O" },
    { value: "N", label: "N" },
    { value: "P", label: "P" },
    { value: "S", label: "S" },
    { value: "F", label: "F" },
    { value: "Cl", label: "Cl" },
  ];

  const getBondMenuItems = () => {
    const bondMenuItems = [];

    molecule.atomList.forEach((atom) => {
      bondMenuItems.push({ value: atom.atomName, label: atom.atomName });
    });

    // Add placeholder items if there aren't enough atoms
    if (bondMenuItems.length < 2) {
      for (let i = bondMenuItems.length; i < 2; i++) {
        bondMenuItems.push({ value: `A${i + 1}`, label: `A${i + 1}` });
      }
    }

    return bondMenuItems;
  };

  const sampleMolecules = ["CH4", "C2H6", "C6H6", "H2O", "SF6", "PCl5"];

  return (
    <div>
      <NavBar />
      <div className="flex flex-col h-screen bg-[#141414] font-inter">
        {/* Warning message for small and medium screens */}
        <div className="flex sm:hidden items-center justify-center h-full w-screen bg-red-500 text-white text-lg font-bold text-center">
          This site is not available on mobile or tablet screens. Please use a
          larger screen.
        </div>
        {/* Main content, hidden on sm and md screens */}
        <div className="hidden sm:flex flex-row w-screen overflow-hidden h-full text-white">
          <div className="flex w-1/4">
            <AISection compoundFormula={compoundFormula} resetAI={resetAI} />
          </div>
          <Plot
            data={[
              traceAtoms,
              traceSingleBonds,
              traceDoubleBonds,
              traceTripleBonds,
            ]}
            layout={layout}
            style={{ width: "50%", height: "100%" }}
          />
          <div className="flex w-1/4">
            <EditMolecule
              atomMenuItems={atomMenuItems}
              bondMenuItems={getBondMenuItems()}
              sampleMolecules={sampleMolecules}
              molecule={molecule}
              setMolecule={setMolecule}
              atomsList={atomsList}
              setAtomsList={setAtomsList}
              handleDataFromEditMolecule={handleDataFromEditMolecule}
              atomCounters={atomCounters}
              handleMoleculeUpdate={handleMoleculeUpdate}
              setAtomCounters={setAtomCounters}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoleculeVisualizer;
