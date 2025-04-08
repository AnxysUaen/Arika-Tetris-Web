import { Block } from "../tetris/block";
import { MapArea } from "../tetris/map";
import { GetShapePositions } from "../utils/utils";

export function drawGrid(areaDraw: MapArea["areaDraw"]) {
    // 创建canvas元素
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error("Failed to get 2D context");
    }
    
    canvas.width = areaDraw[0].length * 50;
    canvas.height = areaDraw.length * 50;
    
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
                ctx.fillRect(j * 50, i * 50, 50, 50);
                // 绘制边框
                ctx.strokeStyle = 'gray';
                ctx.lineWidth = 1;
                ctx.strokeRect(j * 50, i * 50, 50, 50);
            }
        }
    }
    
    // 绘制方块GetShapePositions
    const BlockPositions = GetShapePositions(block.shape, block.position);
    for (const [x, y] of BlockPositions) {
        if (ctx) {
            ctx.fillStyle = block.color;
            ctx.fillRect(x * 50, y * 50, 50, 50);
            // 绘制边框
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            ctx.strokeRect(x * 50, y * 50, 50, 50);
        }
    } 
}
