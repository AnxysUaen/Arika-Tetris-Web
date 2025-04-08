import { Block, blockTypes, blockColors } from "./tetris/block";
import { MapArea } from "./tetris/map";
import { drawGrid, updateGrid } from "./utils/draw";
import { CheckShapeCollision } from "./utils/utils";

let mapArea = new MapArea(10, 20); // 地图区域
let timer = 0; // 定时器
let currentBlocks: Block[] = []; // 当前方块组
let currentBlock: Block | null = null; // 当前活动方块
let canvasData: ReturnType<typeof drawGrid> | null = null; // 画布数据

function gameLoop() {
    // 生成一组方块，顺序随机
    if (currentBlocks.length === 0) {
        const randomBlocks = blockTypes.sort(() => Math.random() - 0.5);
        randomBlocks.forEach((type, index) => {
            let block = new type({ x: 2, y: 0 }, blockColors[index]);
            if (block.type === 'O') block.position = { x: 4, y: 0 }; // O方块位置调整
            currentBlocks.push(block);
        })
    }
    // 1. 检查是否有活动方块，如果没有则生成新的方块
    if (mapArea.clear) {
        mapArea.clear = false; // 设置地图区域不为空
        currentBlock = currentBlocks.shift() ?? null;
        if (currentBlock) {
            if (CheckShapeCollision(currentBlock.shape, currentBlock.position, mapArea.area)) {
                // 如果碰撞，则游戏结束
                clearInterval(timer); // 游戏结束
                // TODO: 停止监听键盘事件
                alert("Game Over!");
                return;
            }
            updateGrid(canvasData, mapArea.areaDraw, currentBlock); // 绘制方块
        }
    } else {
        if (currentBlock) {
            const result = currentBlock.move(mapArea, "down"); // 向下移动方块
            if (result.moveable) {
                updateGrid(canvasData, mapArea.areaDraw, currentBlock); // 更新画布
            }
            if (result.fixed) {
                mapArea.fixBlock(currentBlock); // 固定方块
                mapArea.clearFullLines(); // 清除满行
                mapArea.clear = true; // 设置地图区域为空
            }
        }
    }
    // 2. 检查碰撞
    // 3. 更新地图区域
    // 4. 渲染游戏画面
}

function startGame() {
    if (timer) clearInterval(timer); // 清除之前的定时器
    mapArea = new MapArea(10, 20);
    if (!canvasData) {
        canvasData = drawGrid(mapArea.areaDraw); // 创建画布
    }
    // 启动游戏循环
    timer = setInterval(gameLoop, 1000); // 60 FPS
}

startGame(); // 启动游戏