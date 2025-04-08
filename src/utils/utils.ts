import type { Block, BlockRotateDirection } from '../tetris/block';

/**
 * 获取形状精确位置数组
 * ../param shape 方块数组
 * ../param position 方块位置
 * ../returns 是否碰撞
 */
export function GetShapePositions(shape: Block["shape"], position: Block["position"]) : number[][] {
    const positionList = shape.flatMap((row, y) => row.flatMap((cell, x) => cell ? [[x, y]] : []));
    for (const xy of positionList) {
        xy[0] += position.x;
        xy[1] += position.y;
    }
    return positionList;
}

/**
 * 检查方块是否与地图区域发生碰撞
 * ../param shape 方块数组
 * ../param position 方块位置
 * ../param mapArea 地图数组
 * ../returns 是否碰撞
 */
export function CheckShapeCollision(shape: Block["shape"], position: Block["position"], mapArea: number[][]) : boolean {
    const positionList = GetShapePositions(shape, position);
    for (const [x, y] of positionList) {
        if (x < 0 || x >= mapArea[0].length || y >= mapArea.length || mapArea[y][x]) {
            return true; // 碰撞
        }
    }
    return false;
}

/**
 * 方向标识旋转辅助方法
 * ../param direction 方向标识
 * ../param clockwise 旋转方向，1为顺时针，-1为逆时针
 * ../return 旋转后的方向标识
 */
export function rotateDirection(direction: Block["direction"], clockwise: BlockRotateDirection): Block["direction"] {
    // 获取当前方向对应的数字
    const newDirection = (parseInt(direction) + clockwise + 4) % 4; // +4 是为了处理负数情况
    return newDirection.toString() as Block["direction"];
}


export const ArikaSRS = {
    "Iblock": {
        "0": {
            "1": [[0, 0], [-2, 0], [1, 0], [1, 2], [-2, -1]],
            "3": [[0, 0], [2, 0], [-1, 0], [-1, 2], [2, -1]]
        },
        "1": {
            "0": [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
            "2": [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]]
        },
        "2": {
            "1": [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -1]],
            "3": [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -1]]
        },
        "3": {
            "2": [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]],
            "0": [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]]
        }
    },
    "Other": {
        "0": {
            "1": [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
            "3": [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]]
        },
        "1": {
            "0": [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
            "2": [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]]
        },
        "2": {
            "1": [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
            "3": [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]]
        },
        "3": {
            "0": [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
            "2": [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]]
        }
    }
}