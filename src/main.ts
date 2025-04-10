import { Block, blockTypes, blockColors } from "./tetris/block.js";
import { MapArea } from "./tetris/map.js";
import { drawGrid, updateGrid } from "./utils/draw.js";
import { CheckShapeCollision } from "./utils/utils.js";

import { gameLevel } from "./config.js"; // 游戏速度

let mapArea: MapArea; // 地图区域
let timer = 0; // 定时器
let currentBlocks: Block[] = []; // 当前方块组
let currentBlock: Block | undefined; // 当前活动方块
let canvasData: ReturnType<typeof drawGrid>; // 画布数据

function gameLoop() {
    // 生成一组方块，顺序随机
    if (currentBlocks.length === 0) {
        const randomBlocks = blockTypes.sort(() => Math.random() - 0.5);
        randomBlocks.forEach((type, index) => {
            let block = new type({ x: 3, y: 0 }, blockColors[index]);
            if (block.type === 'O') block.position = { x: 4, y: 0 }; // O方块位置调整
            currentBlocks.push(block);
        })
    }
    // 1. 检查是否有活动方块，如果没有则生成新的方块
    if (mapArea.clear) {
        mapArea.clear = false; // 设置地图区域不为空
        currentBlock = currentBlocks.shift();
        if (currentBlock) {
            if (CheckShapeCollision(currentBlock.shape, currentBlock.position, mapArea.area)) {
                gameOver()
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
}

function handleKeyDown(event: KeyboardEvent) {
    if (currentBlock) {
        switch (event.key) {
            case "ArrowLeft":
                currentBlock.move(mapArea, "left"); // 向左移动
                break;
            case "ArrowRight":
                currentBlock.move(mapArea, "right"); // 向右移动
                break;
            case "ArrowDown":
                currentBlock.move(mapArea, "down"); // 向下移动
                break;
            case "ArrowUp":
                currentBlock.rotate(mapArea, 1); // 旋转方块
                break;
        }
        updateGrid(canvasData, mapArea.areaDraw, currentBlock); // 更新画布
    }
}

function startGame() {
    if (timer) clearInterval(timer); // 清除之前的定时器
    mapArea = new MapArea(10, 20);
    if (!canvasData) {
        canvasData = drawGrid(mapArea.areaDraw); // 创建画布
    }
    // 启动游戏循环
    timer = setInterval(gameLoop, gameLevel);
    // 绑定键盘短按或长按事件
    document.addEventListener("keydown", handleKeyDown); // 绑定键盘事件
}

function gameOver() {
    alert("Game Over!");
    if (timer) clearInterval(timer); // 清除定时器
    timer = 0; // 重置定时器
    currentBlocks = []; // 清空当前方块组
    currentBlock = undefined; // 清空当前活动方块
    // 移除键盘监听事件
    document.removeEventListener("keydown", handleKeyDown); // 移除键盘事件监听器
}

startGame(); // 启动游戏