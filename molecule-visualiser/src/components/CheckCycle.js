export function checkCycle(molecule) {
    let visited = {};
    for (let atom of molecule.atomList) visited[atom.atomName] = false;
    for (let atom of molecule.atomList) {
        if (!visited[atom.atomName]) {
            if (DFS(null, atom, visited, molecule)) {
                return true;
            }
        }
    }
    return false;
}

function DFS(parentAtom, currentAtom, visited, molecule) {
    visited[currentAtom.atomName] = true;
    for (let neighbour of molecule.getNeighbours(currentAtom)) {
        if (!visited[neighbour.atomName]) {
            if (DFS(currentAtom, neighbour, visited, molecule)) {
                return true;
            }
        } else if (neighbour.atomName !== parentAtom?.atomName) {
            return true;
        }
    }
    return false;
}