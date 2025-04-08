// 导出俄罗斯方块地图区域类
import type { Block } from '@tetris/block';

export type MapAreaType = number[][]; // 地图区域类型

export class MapArea {
    width: number;
    height: number;
    // 地图区域的数组矩阵
    area: MapAreaType;
    
    constructor(width: number = 10, height: number = 20) {
        this.width = width;
        this.height = height;
        this.area = Array.from({ length: height }, () => Array(width).fill(0));
    }
    
    // 创建方块方法，接收七类方块对象
    createBlock(block: Block) {
        const { shape, position } = block;
        for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape[i].length; j++) {
                if (shape[i][j]) {
                    this.area[position.y + i][position.x + j] = shape[i][j];
                }
            }
        }
    }
}