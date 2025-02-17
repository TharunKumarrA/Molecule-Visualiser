import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import { checkCycle } from "./CheckCycle";
import { Molecule } from "./GraphADT";
import { addAtoms, addBonds, createAtomNode, getCoordinates } from "./Molecule";

export default function EditMolecule({
  atomMenuItems,
  bondMenuItems,
  sampleMolecules,
  molecule,
  setMolecule,
  atomsList,
  setAtomsList,
  handleDataFromEditMolecule,
  atomCounters,
  handleMoleculeUpdate,
  setAtomCounters,
}) {
  const [expandedAccordion, setExpandedAccordion] = useState("panel1");
  const [atomData, setAtomData] = useState({
    atomType: "C",
    hybridization: "sp",
  });
  const [bondData, setBondData] = useState({
    bondFrom: bondMenuItems[0].value,
    bondTo: bondMenuItems[1].value,
    bondType: "single",
  });
  const [selectedMolecule, setSelectedMolecule] = useState(sampleMolecules[0]);

  const handleChangeAccordion = (panel) => (event, newExpanded) => {
    setExpandedAccordion(newExpanded ? panel : null);
  };

  const handleAtomChange = (e) => {
    const { name, value } = e.target;
    setAtomData((prevData) => ({ ...prevData, [name]: value }));
    console.log("currently selected atom type: ", value);
  };

  const handleBondChange = (e) => {
    const { name, value } = e.target;
    setBondData((prevData) => ({ ...prevData, [name]: value }));
    console.log("currently selected bond type: ", value);
  };

  const handleShowMolecule = () => {
    switch (selectedMolecule) {
      case "CH4":
        const methane = new Molecule();

        addAtoms(methane, createAtomNode("C0", "sp3", "C"));
        addAtoms(methane, createAtomNode("H0", "sp", "H"));
        addAtoms(methane, createAtomNode("H1", "sp", "H"));
        addAtoms(methane, createAtomNode("H2", "sp", "H"));
        addAtoms(methane, createAtomNode("H3", "sp", "H"));

        addBonds(methane, "C0", "H0", true, false, false);
        addBonds(methane, "C0", "H1", true, false, false);
        addBonds(methane, "C0", "H2", true, false, false);
        addBonds(methane, "C0", "H3", true, false, false);

        setAtomCounters({ C: 1, H: 4, O: 0, N: 0 });
        getCoordinates(methane);
        setMolecule(methane);
        break;
      case "C2H6":
        const ethane = new Molecule();

        addAtoms(ethane, createAtomNode("C0", "sp3", "C"));
        addAtoms(ethane, createAtomNode("C1", "sp3", "C"));
        addAtoms(ethane, createAtomNode("H0", "sp", "H"));
        addAtoms(ethane, createAtomNode("H1", "sp", "H"));
        addAtoms(ethane, createAtomNode("H2", "sp", "H"));
        addAtoms(ethane, createAtomNode("H3", "sp", "H"));
        addAtoms(ethane, createAtomNode("H4", "sp", "H"));
        addAtoms(ethane, createAtomNode("H5", "sp", "H"));

        addBonds(ethane, "C0", "H0", true, false, false);
        addBonds(ethane, "C0", "H1", true, false, false);
        addBonds(ethane, "C0", "H2", true, false, false);
        addBonds(ethane, "C0", "C1", true, false, false);
        addBonds(ethane, "C1", "H3", true, false, false);
        addBonds(ethane, "C1", "H4", true, false, false);
        addBonds(ethane, "C1", "H5", true, false, false);

        setAtomCounters({ C: 2, H: 6, O: 0, N: 0 });
        getCoordinates(ethane);
        setMolecule(ethane);
        break;
      case "C6H6":
        const benzene = new Molecule();
        addAtoms(benzene, createAtomNode("C0", "sp2", "C"));
        addAtoms(benzene, createAtomNode("C1", "sp2", "C"));
        addAtoms(benzene, createAtomNode("C2", "sp2", "C"));
        addAtoms(benzene, createAtomNode("C3", "sp2", "C"));
        addAtoms(benzene, createAtomNode("C4", "sp2", "C"));
        addAtoms(benzene, createAtomNode("C5", "sp2", "C"));
        addAtoms(benzene, createAtomNode("H0", "sp", "H"));
        addAtoms(benzene, createAtomNode("H1", "sp", "H"));
        addAtoms(benzene, createAtomNode("H2", "sp", "H"));
        addAtoms(benzene, createAtomNode("H3", "sp", "H"));
        addAtoms(benzene, createAtomNode("H4", "sp", "H"));
        addAtoms(benzene, createAtomNode("H5", "sp", "H"));

        addBonds(benzene, "C0", "H0", true, false, false);
        addBonds(benzene, "C0", "C1", true, false, false);
        addBonds(benzene, "C1", "H1", true, false, false);
        addBonds(benzene, "C1", "C2", false, true, false);
        addBonds(benzene, "C2", "H2", true, false, false);
        addBonds(benzene, "C2", "C3", true, false, false);
        addBonds(benzene, "C3", "H3", true, false, false);
        addBonds(benzene, "C3", "C4", false, true, false);
        addBonds(benzene, "C4", "H4", true, false, false);
        addBonds(benzene, "C4", "C5", true, false, false);
        addBonds(benzene, "C5", "H5", true, false, false);
        addBonds(benzene, "C5", "C0", false, true, false);

        setAtomCounters({ C: 6, H: 6, O: 0, N: 0 });
        getCoordinates(benzene);
        setMolecule(benzene);
        break;
      case "H2O":
        const water = new Molecule();

        addAtoms(water, createAtomNode("O0", "sp3", "O"));
        addAtoms(water, createAtomNode("H0", "sp", "H"));
        addAtoms(water, createAtomNode("H1", "sp", "H"));

        addBonds(water, "O0", "H0", true, false, false);
        addBonds(water, "O0", "H1", true, false, false);

        setAtomCounters({ C: 0, H: 2, O: 1, N: 0 });
        getCoordinates(water);
        setMolecule(water);
        break;
      default:
        break;
    }
  };

  const handleSubmitAtom = (e) => {
    e.preventDefault();
    const data = {
      type: "atom",
      atomName: atomData.atomType + atomsList.length,
      hybridisation: atomData.hybridization,
      atomSymbol: atomData.atomType,
    };
    handleDataFromEditMolecule(data);
  };

  const handleSubmitBond = (e) => {
    e.preventDefault();
    let single,
      double,
      triple = false;
    if (bondData.bondType === "single") {
      single = true;
      double = false;
      triple = false;
    }
    if (bondData.bondType === "double") {
      single = false;
      double = true;
      triple = false;
    }
    if (bondData.bondType === "triple") {
      single = false;
      double = false;
      triple = true;
    }
    const data = {
      type: "bond",
      atom1Name: bondData.bondFrom,
      atom2Name: bondData.bondTo,
      isSingleBond: single,
      isDoubleBond: double,
      isTripleBond: triple,
    };
    handleDataFromEditMolecule(data);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-4/5">
        <Accordion
          expanded={expandedAccordion === "panel1"}
          onChange={handleChangeAccordion("panel1")}
          defaultExpanded={true}
          sx={{ backgroundColor: "#2ABD91" }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            ADD ATOMS
          </AccordionSummary>
          <AccordionDetails className="bg-[#1e1e1e] text-white flex flex-col items-center">
            <form
              onSubmit={handleSubmitAtom}
              className="w-full flex flex-col items-center"
            >
              <RadioGroup
                defaultValue="C"
                row
                name="atomType"
                onChange={handleAtomChange}
              >
                {atomMenuItems.map((item) => (
                  <FormControlLabel
                    key={item.value}
                    value={item.value}
                    control={<Radio />}
                    label={item.label}
                  />
                ))}
              </RadioGroup>
              <div className="text-center my-2">Hybridization</div>
              <RadioGroup
                defaultValue="sp"
                row
                name="hybridization"
                onChange={handleAtomChange}
              >
                <FormControlLabel value="sp" control={<Radio />} label="sp" />
                <FormControlLabel value="sp2" control={<Radio />} label="sp2" />
                <FormControlLabel value="sp3" control={<Radio />} label="sp3" />
              </RadioGroup>
              <Button
                type="submit"
                variant="outlined"
                sx={{ color: "white", borderColor: "#2ABD91", marginTop: 2 }}
              >
                ADD ATOM
              </Button>
            </form>
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={expandedAccordion === "panel2"}
          onChange={handleChangeAccordion("panel2")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
            sx={{ backgroundColor: "#2ABD91" }}
          >
            ADD BONDS
          </AccordionSummary>
          <AccordionDetails className="bg-[#1e1e1e] text-white flex flex-col">
            <form
              onSubmit={handleSubmitBond}
              className="w-full flex flex-col items-center"
            >
              <div className="flex flex-row justify-between items-center">
                <Select
                  name="bondFrom"
                  defaultValue={bondMenuItems[0].value}
                  onChange={handleBondChange}
                  sx={{ color: "white" }}
                >
                  {bondMenuItems.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
                <div>------------------</div>
                <Select
                  name="bondTo"
                  defaultValue={bondMenuItems[1].value}
                  onChange={handleBondChange}
                  sx={{ color: "white" }}
                >
                  {bondMenuItems.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </div>
              <div className="text-center my-2">Bond Type</div>
              <RadioGroup
                defaultValue="single"
                row
                name="bondType"
                onChange={handleBondChange}
              >
                <FormControlLabel
                  value="single"
                  control={<Radio />}
                  label="single"
                />
                <FormControlLabel
                  value="double"
                  control={<Radio />}
                  label="double"
                />
                <FormControlLabel
                  value="triple"
                  control={<Radio />}
                  label="triple"
                />
              </RadioGroup>
              <Button
                type="submit"
                variant="outlined"
                sx={{ color: "white", borderColor: "#2ABD91", marginTop: 2 }}
              >
                ADD BOND
              </Button>
            </form>
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={expandedAccordion === "panel3"}
          onChange={handleChangeAccordion("panel3")}
          sx={{ backgroundColor: "#2ABD91" }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3-content"
            id="panel3-header"
          >
            EXAMPLES
          </AccordionSummary>
          <AccordionDetails className="bg-[#1e1e1e] text-white flex flex-col items-center">
            <Select
              value={selectedMolecule}
              onChange={(e) => setSelectedMolecule(e.target.value)}
              sx={{ color: "white" }}
            >
              {sampleMolecules.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
            <Button
              onClick={handleShowMolecule}
              variant="outlined"
              sx={{ color: "white", borderColor: "#2ABD91", marginTop: 2 }}
            >
              SHOW MOLECULE
            </Button>
          </AccordionDetails>
        </Accordion>
        <div className="border-2 rounded-xl px-8 py-4 m-2">
          Check Cycle: {checkCycle(molecule) ? "Cyclic" : "Acyclic"}
        </div>
      </div>
    </div>
  );
}
