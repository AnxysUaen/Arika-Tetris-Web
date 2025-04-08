import { Block } from "../tetris/block.js";
import { MapArea } from "../tetris/map.js";
import { GetShapePositions } from "../utils/utils.js";
import { GridWidth } from "../config.js";

export function drawGrid(areaDraw: MapArea["areaDraw"]) {
    // 创建canvas元素
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error("Failed to get 2D context");
    }
    
    canvas.width = areaDraw[0].length * GridWidth;
    canvas.height = areaDraw.length * GridWidth;
    
    // 将canvas添加到页面
    document.body.appendChild(canvas);
    return { canvas, ctx };
}

export function updateGrid(canvasData: ReturnType<typeof drawGrid> | null, areaDraw: MapArea["areaDraw"], block: Block) {
    if (!canvasData) {
        throw new Error("Canvas data is null");
    }
    const { canvas, ctx } = canvasData;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < areaDraw.length; i++) {
        for (let j = 0; j < areaDraw[i].length; j++) {
            if (ctx) {
                // 绘制地图
                ctx.fillStyle = areaDraw[i][j].color;
                ctx.fillRect(j * GridWidth, i * GridWidth, GridWidth, GridWidth);
                // 绘制边框
                ctx.strokeStyle = 'gray';
                ctx.lineWidth = 1;
                ctx.strokeRect(j * GridWidth, i * GridWidth, GridWidth, GridWidth);
            }
        }
    }
    
    // 绘制方块GetShapePositions
    const BlockPositions = GetShapePositions(block.shape, block.position);
    for (const [x, y] of BlockPositions) {
        if (ctx) {
            ctx.fillStyle = block.color;
            ctx.fillRect(x * GridWidth, y * GridWidth, GridWidth, GridWidth);
            // 绘制边框
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            ctx.strokeRect(x * GridWidth, y * GridWidth, GridWidth, GridWidth);
        }
    } 
}
