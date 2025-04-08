// 导出俄罗斯方块地图区域类
import type { Block } from '../tetris/block.js';
import { GetShapePositions } from '../utils/utils.js';

type MapAreaType = number[][]; // 地图区域类型
type MapAreaDrawType = { color: string }[][]; // 地图区域类型

export class MapArea {
    width: number;
    height: number;
    // 地图区域的数组矩阵
    area: MapAreaType;
    areaDraw: MapAreaDrawType; // 绘制区域

    clear: boolean = true; // 是否不存在活动方块
    
    constructor(width: number = 10, height: number = 20) {
        this.width = width;
        this.height = height;
        this.area = Array.from({ length: height }, () => Array(width).fill(0));
        this.areaDraw = Array.from({ length: height }, () => Array(width).fill({ color: 'white' }));
    }
    
    // 固定方块方法
    fixBlock(block: Block) {
        const { shape, color, position } = block;
        const positionList = GetShapePositions(shape, position); // 获取方块的精确位置数组
        for (const [x, y] of positionList) {
            this.area[y][x] = 1;
            this.areaDraw[y][x] = { color }; // 设置颜色
        }
    }

    // 清除满行方法
    clearFullLines() {
        let linesCleared = 0;
        for (let y = this.height - 1; y >= 0; y--) {
            if (this.area[y].every(cell => cell === 1)) {
                this.area.splice(y, 1); // 删除满行
                this.area.unshift(Array(this.width).fill(0)); // 在顶部添加新行
                this.areaDraw.splice(y, 1); // 删除满行
                this.areaDraw.unshift(Array(this.width).fill({ color: 'white' })); // 在顶部添加新行
                linesCleared++;
            }
        }
        return linesCleared;
    }
}