import type { Block, BlockRotateDirection } from '@tetris/block';

/**
 * 检查方块是否与地图区域发生碰撞
 * @param shape 方块数组
 * @param position 方块位置
 * @param mapArea 地图数组
 * @returns 是否碰撞
 */
export function CheckShapeCollision(shape: Block["shape"], position: Block["position"], mapArea: number[][]) : boolean {
    const positionList = shape.flatMap((row, y) => row.flatMap((cell, x) => cell ? [[x, y]] : []));
    for (const [x, y] of positionList) {
        const newX = position.x + x;
        const newY = position.y + y;
        if (newX < 0 || newX >= mapArea[0].length || newY >= mapArea.length || mapArea[newY][newX]) {
            return true; // 碰撞
        }
    }
    return false;
}

/**
 * 方向标识旋转辅助方法
 * @param direction 方向标识
 * @param clockwise 旋转方向，1为顺时针，-1为逆时针
 * @return 旋转后的方向标识
 */
export function rotateDirection(direction: Block["direction"], clockwise: BlockRotateDirection): Block["direction"] {
    // 获取当前方向对应的数字
    const newDirection = (parseInt(direction) + clockwise + 4) % 4; // +4 是为了处理负数情况
    return newDirection.toString() as Block["direction"];
}
