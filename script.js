'use strict';

var cube;

var controls;

var Face = {};

/**
 * Swaps two tiles.
 * @param {number} i1 Index of the first tile
 * @param {number} i2 Index of the second tile
 */
Face.swapTiles = function(i1, i2) {
    var temp = this.tiles[i1];
    this.tiles[i1] = this.tiles[i2];
    this.tiles[i2] = temp;
};

/**
 * Returns a specified row of tiles.
 * @param {number} i Index of the row to get
 * @return {number[]} Array of tiles in specified row
 */
Face.getRow = function(i) {
    i *= 3;
    return [this.tiles[i++], this.tiles[i++], this.tiles[i++]];
};

/**
 * Returns a specified column of tiles.
 * @param {number} i Index of the column to get
 * @return {number[]} Array of tiles in specified column
 */
Face.getColumn = function(i) {
    if (this.isInverted) this.invert();
    var result = [this.tiles[i], this.tiles[i + 3], this.tiles[i + 6]];
    if (this.isInverted) this.invert();
    return result;
};

/**
 * Replaces the tiles in a specified row with new tiles, and returns the previous tiles in that row.
 * @param {number} i Index of the row to replace
 * @param {number[]} row Array of three tiles to fill the specified row with
 * @return {number[]} Tiles that were previously in the specified row
 */
Face.replaceRow = function(i, row) {
    var before = this.getRow(i);
    i *= 3;
    this.tiles[i++] = row[0];
    this.tiles[i++] = row[1];
    this.tiles[i++] = row[2];
    return before;
};

/**
 * Replaces the tiles in a specified column with new tiles, and returns the previous tiles in that column.
 * @param {number} i Index of the column to replace
 * @param {number[]} column Array of three tiles to fill the specified column with
 * @return {number[]} Tiles that were previously in the specified column
 */
Face.replaceColumn = function(i, column) {
    var before = this.getColumn(i);
    if (this.isInverted) this.invert();
    this.tiles[i] = column[0];
    this.tiles[i + 3] = column[1];
    this.tiles[i + 6] = column[2];
    if (this.isInverted) this.invert();
    return before;
};

/**
 * Shifts a row of tiles over to the next face in the specified direction, and keeps going until the starting face is reached again.
 * @param {number} i Index of the row to shift
 * @param {string} dir Direction to move the row in ('l' for left, 'r' for right)
 */
Face.shiftRow = function(i, dir) {
    var temp = this.adjacent[dir].replaceRow(i, this.getRow(i));
    temp = this.adjacent[dir].adjacent[dir].replaceRow(i, temp);
    temp = this.adjacent[dir].adjacent[dir].adjacent[dir].replaceRow(i, temp);
    this.replaceRow(i, temp);
};

/**
 * Shifts a column of tiles over to the next face in the specified direction, and keeps going until the starting face is reached again.
 * @param {number} i Index of the column to shift
 * @param {string} dir Direction to move the column in ('u' for up, 'd' for down)
 */
Face.shiftColumn = function(i, dir) {
    var temp = this.adjacent[dir].replaceColumn(i, this.getColumn(i));
    temp = this.adjacent[dir].adjacent[dir].replaceColumn(i, temp);
    temp = this.adjacent[dir].adjacent[dir].adjacent[dir].replaceColumn(i, temp);
    this.replaceColumn(i, temp);
};

/**
 * Turns the entire face clockwise or counterclockwise by 90 degrees.
 * @param {boolean} clockwise true if the face is to be turned clockwise, false otherwise
 */
Face.turn = function(clockwise) {
    if (clockwise) {
        this.swapTiles(1, 5);
        this.swapTiles(1, 7);
        this.swapTiles(1, 3);
        this.swapTiles(0, 2);
        this.swapTiles(0, 8);
        this.swapTiles(0, 6);
    } else {
        this.swapTiles(1, 3);
        this.swapTiles(1, 7);
        this.swapTiles(1, 5);
        this.swapTiles(0, 6);
        this.swapTiles(0, 8);
        this.swapTiles(0, 2);
    }
};

/**
 * Inverts the face horizontally and vertically. Necessary for back face when shifting up or down.
 */
Face.invert = function() {
    this.swapTiles(0, 8);
    this.swapTiles(1, 7);
    this.swapTiles(2, 6);
    this.swapTiles(3, 5);
}

var Cube = {};

Cube.def = {
    f: {l: 'l', r: 'r', u: 'u', d: 'd'},
    l: {l: 'b', r: 'f'},
    r: {l: 'f', r: 'b'},
    u: {u: 'b', d: 'f'},
    d: {u: 'f', d: 'b'},
    b: {l: 'r', r: 'l', u: 'd', d: 'u'}
};

Cube.u = function() {
    this.faces.f.shiftRow(0, 'l');
    this.faces.u.turn(true);
    updateView();
};

Cube.ur = function() {
    this.faces.f.shiftRow(0, 'r');
    this.faces.u.turn(false);
    updateView();
};

Cube.cl = function() {
    this.faces.f.shiftRow(1, 'l');
    updateView();
};

Cube.cr = function() {
    this.faces.f.shiftRow(1, 'r');
    updateView();
};

Cube.d = function() {
    this.faces.f.shiftRow(2, 'r');
    this.faces.d.turn(true);
    updateView();
};

Cube.dr = function() {
    this.faces.f.shiftRow(2, 'l');
    this.faces.d.turn(false);
    updateView();
};

Cube.turnLeft = function() {
    this.u();
    this.cl();
    this.dr();
    updateView();
};

Cube.turnRight = function() {
    this.ur();
    this.cr();
    this.d();
    updateView();
};

Cube.l = function() {
    this.faces.f.shiftColumn(0, 'd');
    this.faces.l.turn(true);
    updateView();
};

Cube.lr = function() {
    this.faces.f.shiftColumn(0, 'u');
    this.faces.l.turn(false);
    updateView();
};

Cube.cu = function() {
    this.faces.f.shiftColumn(1, 'u');
    updateView();
};

Cube.cd = function() {
    this.faces.f.shiftColumn(1, 'd');
    updateView();
};

Cube.r = function() {
    this.faces.f.shiftColumn(2, 'u');
    this.faces.r.turn(true);
    updateView();
};

Cube.rr = function() {
    this.faces.f.shiftColumn(2, 'd');
    this.faces.r.turn(false);
    updateView();
};

Cube.turnUp = function() {
    this.lr();
    this.cu();
    this.r();
    updateView();
};

Cube.turnDown = function() {
    this.l();
    this.cd();
    this.rr();
    updateView();
};

Cube.f = function() {
    this.turnRight();
    this.r();
    this.turnLeft();
};

Cube.fr = function() {
    this.turnLeft();
    this.lr();
    this.turnRight();
};

Cube.b = function() {
    this.turnRight();
    this.l();
    this.turnLeft();
};

Cube.br = function() {
    this.turnLeft();
    this.rr();
    this.turnRight();
};

Cube.init = function() {
    this.faces = {};
    var faces = ['f', 'l', 'r', 'u', 'd', 'b'];

    for (var i = 0; i < faces.length; i++) {
        var face = faces[i];
        this.faces[face] = Object.create(Face);
        this.faces[face].tiles = [];
    }

    var dirs = ['l', 'r', 'u', 'd'];

    for (var f = 0; f < faces.length; f++) {
        var face = faces[f];
        this.faces[face].adjacent = {};
        for (var d = 0; d < dirs.length; d++) {
            var dir = dirs[d];
            if (this.def[face][dir]) this.faces[face].adjacent[dir] = this.faces[this.def[face][dir]];
        }
    }

    this.faces.b.isInverted = true;

    this.reset();
};

Cube.reset = function() {
    var faces = ['f', 'l', 'r', 'u', 'd', 'b'];
    for (var i = 0; i < faces.length; i++) for (var t = 0; t < 9; t++) cube.faces[faces[i]].tiles[t] = i + 1;
    updateView();
};

Cube.scramble = function(moveAmount) {
    var moves = ['l', 'lr', 'r', 'rr', 'u', 'ur', 'd', 'dr', 'cl', 'cr', 'cu', 'cd'];
    moveAmount = moveAmount || 50;
    for (var i = 0; i < moveAmount; i++) cube[moves[Math.floor(Math.random() * moves.length)]]();
};

function init() {
    initCube();
    initButtons();
    initKeys();
    updateView();
}

function initCube() {
    cube = Object.create(Cube);
    cube.init();
}

function initButtons() {
    document.getElementById('btnU').addEventListener('click', function() {cube.u()});
    document.getElementById('btnUr').addEventListener('click', function() {cube.ur()});
    document.getElementById('btnCl').addEventListener('click', function() {cube.cl()});
    document.getElementById('btnCr').addEventListener('click', function() {cube.cr()});
    document.getElementById('btnD').addEventListener('click', function() {cube.d()});
    document.getElementById('btnDr').addEventListener('click', function() {cube.dr()});
    document.getElementById('btnCubeLeft').addEventListener('click', function() {cube.turnLeft()});
    document.getElementById('btnCubeRight').addEventListener('click', function() {cube.turnRight()});
    document.getElementById('btnL').addEventListener('click', function() {cube.l()});
    document.getElementById('btnLr').addEventListener('click', function() {cube.lr()});
    document.getElementById('btnCu').addEventListener('click', function() {cube.cu()});
    document.getElementById('btnCd').addEventListener('click', function() {cube.cd()});
    document.getElementById('btnR').addEventListener('click', function() {cube.r()});
    document.getElementById('btnRr').addEventListener('click', function() {cube.rr()});
    document.getElementById('btnCubeUp').addEventListener('click', function() {cube.turnUp()});
    document.getElementById('btnCubeDown').addEventListener('click', function() {cube.turnDown()});
    document.getElementById('btnF').addEventListener('click', function() {cube.f()});
    document.getElementById('btnFr').addEventListener('click', function() {cube.fr()});
    document.getElementById('btnB').addEventListener('click', function() {cube.b()});
    document.getElementById('btnBr').addEventListener('click', function() {cube.br()});
    document.getElementById('btnScramble').addEventListener('click', function() {cube.scramble()});
    document.getElementById('btnReset').addEventListener('click', function() {cube.reset()});
}

function initKeys() {
    controls = {
        selectedRow: -1,
        selectedColumn: -1,
        selectionUp: function() {
            if (controls.selectedRow < 0 || controls.selectedRow > 2) controls.selectedRow = 2;
            else controls.selectedRow--;
            controls.updateSelection();
        },
        selectionDown: function() {
            if (controls.selectedRow < 0 || controls.selectedRow > 2) controls.selectedRow = 0;
            else controls.selectedRow++;
            controls.updateSelection();
        },
        selectionLeft: function() {
            if (controls.selectedColumn < 0 || controls.selectedColumn > 2) controls.selectedColumn = 2;
            else controls.selectedColumn--;
            controls.updateSelection();
        },
        selectionRight: function() {
            if (controls.selectedColumn < 0 || controls.selectedColumn > 2) controls.selectedColumn = 0;
            else controls.selectedColumn++;
            controls.updateSelection();
        },
        updateSelection: function() {
            var root = document.getElementsByClassName('cube')[0];
            root.setAttribute('data-selected-row', controls.selectedRow);
            root.setAttribute('data-selected-column', controls.selectedColumn);
        },
        moveUp: function() {
            switch (controls.selectedColumn) {
                case 0: cube.lr(); break;
                case 1: cube.cu(); break;
                case 2: cube.r(); break;
                default: break;
            }
        },
        moveDown: function() {
            switch (controls.selectedColumn) {
                case 0: cube.l(); break;
                case 1: cube.cd(); break;
                case 2: cube.rr(); break;
                default: break;
            }
        },
        moveLeft: function() {
            switch (controls.selectedRow) {
                case 0: cube.u(); break;
                case 1: cube.cl(); break;
                case 2: cube.dr(); break;
                default: break;
            }
        },
        moveRight: function() {
            switch (controls.selectedRow) {
                case 0: cube.ur(); break;
                case 1: cube.cr(); break;
                case 2: cube.d(); break;
                default: break;
            }
        }
    };

    window.addEventListener('keydown', function(e) {
        switch (e.which) {
            case 87:
                controls.selectionUp();
                break;
            case 83:
                controls.selectionDown();
                break;
            case 65:
                controls.selectionLeft();
                break;
            case 68:
                controls.selectionRight();
                break;
            case 38:
                if(e.shiftKey) cube.turnUp();
                else controls.moveUp();
                break;
            case 40:
                if(e.shiftKey) cube.turnDown();
                else controls.moveDown();
                break;
            case 37:
                if(e.shiftKey) cube.turnLeft();
                else controls.moveLeft();
                break;
            case 39:
                if(e.shiftKey) cube.turnRight();
                else controls.moveRight();
                break;
            default: break;
        }
    })
}

function updateView() {
    var faces = ['f', 'l', 'r', 'u', 'd'];

    for (var i = 0; i < faces.length; i++) {
        var f = faces[i];
        var tiles = document.getElementById('face-' + f).getElementsByClassName('tile');
        for (var t = 0; t < tiles.length; t++) tiles[t].className = 'tile c' + cube.faces[f].tiles[t];
    }
}

window.addEventListener('load', init);
