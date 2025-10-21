export interface WordLocation {
  word: string
  cells: [number, number][]
}

export function generateGrid(rows: number, cols: number, words: string[]): string[][] {
  const grid: string[][] = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(""))

  // Place words in grid
  for (const word of words) {
    let placed = false
    let attempts = 0

    while (!placed && attempts < 100) {
      const direction = Math.floor(Math.random() * 8)
      const row = Math.floor(Math.random() * rows)
      const col = Math.floor(Math.random() * cols)

      if (canPlaceWord(grid, word, row, col, direction, rows, cols)) {
        placeWord(grid, word, row, col, direction)
        placed = true
      }
      attempts++
    }
  }

  // Fill remaining cells with random letters
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === "") {
        grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26))
      }
    }
  }

  return grid
}

function canPlaceWord(
  grid: string[][],
  word: string,
  row: number,
  col: number,
  direction: number,
  rows: number,
  cols: number,
): boolean {
  const [dr, dc] = getDirection(direction)

  for (let i = 0; i < word.length; i++) {
    const r = row + dr * i
    const c = col + dc * i

    if (r < 0 || r >= rows || c < 0 || c >= cols) return false
    if (grid[r][c] !== "" && grid[r][c] !== word[i]) return false
  }

  return true
}

function placeWord(grid: string[][], word: string, row: number, col: number, direction: number): void {
  const [dr, dc] = getDirection(direction)

  for (let i = 0; i < word.length; i++) {
    grid[row + dr * i][col + dc * i] = word[i]
  }
}

function getDirection(direction: number): [number, number] {
  const directions = [
    [0, 1], // right
    [1, 0], // down
    [1, 1], // diagonal down-right
    [1, -1], // diagonal down-left
    [0, -1], // left
    [-1, 0], // up
    [-1, -1], // diagonal up-left
    [-1, 1], // diagonal up-right
  ]
  return directions[direction] as [number, number]
}

export function findWords(grid: string[][], words: string[]): Map<string, WordLocation> {
  const locations = new Map<string, WordLocation>()
  const rows = grid.length
  const cols = grid[0].length

  for (const word of words) {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        for (let dir = 0; dir < 8; dir++) {
          const cells = getWordCells(grid, word, row, col, dir, rows, cols)
          if (cells.length === word.length) {
            locations.set(word, { word, cells })
            break
          }
        }
        if (locations.has(word)) break
      }
      if (locations.has(word)) break
    }
  }

  return locations
}

function getWordCells(
  grid: string[][],
  word: string,
  row: number,
  col: number,
  direction: number,
  rows: number,
  cols: number,
): [number, number][] {
  const [dr, dc] = getDirection(direction)
  const cells: [number, number][] = []

  for (let i = 0; i < word.length; i++) {
    const r = row + dr * i
    const c = col + dc * i

    if (r < 0 || r >= rows || c < 0 || c >= cols) return []
    if (grid[r][c] !== word[i]) return []

    cells.push([r, c])
  }

  return cells
}
