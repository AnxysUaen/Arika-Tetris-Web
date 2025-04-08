import type { MapArea } from "@tetris/map";
// import { cloneDeep } from "lodash";
import { CheckShapeCollision, rotateDirection } from "@utils/utils";
import ArikaSRS from "@lib/ArikaSRS.json";
import { update, upperCase } from "lodash";

type BlockType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L'; // 方块类型
type BlockShape = number[][]; // 方块形状类型
type BlockPosition = { x: number; y: number }; // 方块位置类型
type BlockDirection = "0" | "1" | "2" | "3"; // 方块方向类型
type BlockMoveDirection = 'left' | 'right' | 'down' | 'bottom'; // 方块移动方向类型
export type BlockRotateDirection = -1 | 1; // 方块旋转方向类型

export abstract class Block {
    abstract type: BlockType;
    abstract shape: BlockShape;

    position: BlockPosition;
    color: string;
    direction: BlockDirection;

    move: (mapArea: MapArea, direction: BlockMoveDirection) => { moveable: boolean, fixed: Boolean } = (mapArea, direction) => {
        return moveBlock(this, mapArea, direction);
    };
    // 旋转方法，遵循Arika SRS旋转规则
    abstract rotateRule?: Record<BlockDirection, any>; // 旋转规则
    rotate: (mapArea: MapArea, clockwise: BlockRotateDirection) => { rotateable: boolean } = (mapArea, clockwise) => {
        return rotateBlock(this, mapArea, clockwise);
    };

    constructor(position: BlockPosition, color: string) {
        this.position = position; // 方块位置
        this.color = color; // 方块颜色
        this.direction = "0"; // 初始方向
    }
}

function moveBlock(block: Block, mapArea: MapArea, direction: BlockMoveDirection) {
    const { shape, position } = block;
    const { area } = mapArea;
    let { x, y } = position;

    // 定义方向对应的位移
    const moveDelta: Record<BlockMoveDirection, { dx: number; dy: number }> = {
        left:   { dx: -1, dy: 0 },
        right:  { dx: 1,  dy: 0 },
        down:   { dx: 0,  dy: 1 },
        bottom: { dx: 0,  dy: 0 }, // 特殊处理
    };

    const { dx, dy } = moveDelta[direction];

    if (direction === 'bottom') {
        // 特殊处理：移动到底部
        while (!CheckShapeCollision(shape, { x, y: y + 1 }, area)) {
            y++;
        }
        block.position = { x, y };
        return { moveable: true, fixed: true };
    }

    // 检查碰撞
    const newPosition = { x: x + dx, y: y + dy };
    if (CheckShapeCollision(shape, newPosition, area)) {
        // 如果是向下移动且碰撞，则固定
        // 其他情况碰撞则无法移动，返回原坐标
        return { moveable: false, fixed: direction === 'down' };
    }

    // 返回更新后的位置
    block.position = newPosition;
    return { moveable: true, fixed: false };
}

function rotateBlock(block: Block, mapArea: MapArea, clockwise: BlockRotateDirection) {
    const { type, shape, position, direction } = block;
    if (type === "O") {
        // O方块不需要旋转
        return { rotateable: true, position, shape };
    }
    let rotatedShape: BlockShape = [];
    if (clockwise === 1) {
        rotatedShape = shape.toReversed().map((_, i) => shape.map(row => row[i]));
    } else { // 逆时针旋转
        rotatedShape = shape[0].map((_, i) => shape.map(row => row[i])).reverse();
    }
    const newDirection = rotateDirection(direction, clockwise)
    const rotateRule = block.rotateRule?.[direction]?.[newDirection];
    for (const rule of rotateRule || []) {
        const [x, y] = rule;
        const newPosition = { x: position.x + x, y: position.y + y };
        if (!CheckShapeCollision(rotatedShape, newPosition, mapArea.area)) {
            // 如果没有碰撞，则返回新的位置和旋转后的形状
            block.direction = newDirection; // 更新方向
            block.shape = rotatedShape; // 更新形状
            block.position = newPosition; // 更新位置
            return { rotateable: true };
        }
    }
    return { rotateable: false };
}

export class I_Block extends Block {
    type: BlockType = "I";
    shape = [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    rotateRule = ArikaSRS["Iblock"];
}

export class O_Block extends Block {
    type: BlockType = "O";
    shape = [
        [1, 1],
        [1, 1]
    ];
    rotateRule = undefined; // O方块不需要旋转规则
}

export class T_Block extends Block {
    type: BlockType = "T";
    shape = [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ];
    rotateRule = ArikaSRS["Other"];
}

export class S_Block extends Block {
    type: BlockType = "S";
    shape = [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ];
    rotateRule = ArikaSRS["Other"];
}

export class Z_Block extends Block {
    type: BlockType = "Z";
    shape = [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ];
    rotateRule = ArikaSRS["Other"];
}

export class J_Block extends Block {
    type: BlockType = "J";
    shape = [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ];
    rotateRule = ArikaSRS["Other"];
}

export class L_Block extends Block {
    type: BlockType = "L";
    shape = [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ];
    rotateRule = ArikaSRS["Other"];
}

export const blockTypes = [I_Block, O_Block, T_Block, S_Block, Z_Block, J_Block, L_Block]; // 方块类型数组
export const blockColors = ['cyan', 'yellow', 'purple', 'green', 'red', 'blue', 'orange']; // 方块颜色数组