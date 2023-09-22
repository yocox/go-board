/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * An example element.
 *
 * @fires play-stone - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('go-board')
export class GoBoard extends LitElement {
  static override styles = css`
    :host {
      display: block;
      border: solid 1px gray;
      padding: 0px;
      background-color: #F4D99B;
    }
    
    .board {
      aspect-ratio: 1;
      width: 100%;
      max-height: 900px;
    }
  `;

  constructor() {
    super();
    setTimeout(() => { this.drawBoard(); }, 100);
  }

  /**
   * The title of the board.
   */
  @property({ type: String })
  board_title = '扭斷';

  /**
   * The comment of the board.
   */
  @property({ type: String })
  comment = '這樣的局勢是雙方都可以接受';

  /**
   * The size of the board.
   */
  @property({ type: Number })
  size = 13;

  /**
   * The stones of the board.
   */
  @property({ type: Array })
  stones = [
    { x: 3, y: 3, color: 'black' },
    { x: 3, y: 9, color: 'white' },
    { x: 9, y: 2, color: 'white' },
    { x: 10, y: 9, color: 'black' },
  ];
  marks = [
    { x: 2, y: 5, color: 'A' },
    { x: 5, y: 2, color: 'B' },
    { x: 2, y: 2, color: '★' },
  ];

  private _findStone(x: number, y: number): { x: number, y: number, color: string } | null {
    for (const stone of this.stones) {
      if (stone.x === x && stone.y === y) {
        return stone;
      }
    }
    return null;
  }

  private _putStone(x: number, y: number, color: string) {
    const stone = this._findStone(x, y);
    if (stone) {
      return;
    } else {
      this.stones.push({ x: x, y: y, color: color });
    }
  }

  override render() {
    return html`
      <canvas class=board id="go-board"
              @click=${this._onClick}
              @mousemove=${this._onMove}
              @mouseleave=${this._onLeave}
      ></canvas>
    `;
  }

  margin = 0.2;

  private stars9 = [
    { x: 2, y: 2 }, { x: 2, y: 6 },
    { x: 4, y: 4 },
    { x: 6, y: 2 }, { x: 6, y: 6 },
  ];
  private stars13 = [
    { x: 3, y: 3 }, { x: 3, y: 9 },
    { x: 6, y: 6 },
    { x: 9, y: 3 }, { x: 9, y: 9 },
  ];
  private stars19 = [
    { x: 3, y: 3 }, { x: 3, y: 9 }, { x: 3, y: 15 },
    { x: 9, y: 3 }, { x: 9, y: 9 }, { x: 9, y: 15 },
    { x: 15, y: 3 }, { x: 15, y: 9 }, { x: 15, y: 15 },
  ];

  private _drawBoard(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    const size = this.size;
    const gr = this.grid_ratio;
    const boardSize = gr * (size + 1);
    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = '#F4D99B';
    ctx.fillRect(0, 0, boardSize, boardSize);
    ctx.strokeStyle = '#6C4C1F';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < size; i++) {
      ctx.moveTo((i + this.margin + 0.5) * gr * w, (this.margin + 0.5) * gr * h);
      ctx.lineTo((i + this.margin + 0.5) * gr * w, (this.margin + 0.5 + size - 1) * gr * h);
      ctx.moveTo((this.margin + 0.5) * gr * w, (i + this.margin + 0.5) * gr * h);
      ctx.lineTo((this.margin + 0.5 + size - 1) * gr * w, (i + this.margin + 0.5) * gr * h);
    }
    ctx.stroke();
    ctx.closePath();

    const stars = size === 9 ? this.stars9 : size === 13 ? this.stars13 : size === 19 ? this.stars19 : [];
    for (const star of stars) {
      ctx.fillStyle = '#6C4C1F';
      ctx.beginPath();
      const radius = gr * w * 0.11;
      ctx.arc((star.x + this.margin + 0.5) * gr * w, (star.y + this.margin + 0.5) * gr * h, radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    }
  }

  private _drawStone(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, stone: { x: number, y: number, color: string }, alpha: number) {
    const gr = this.grid_ratio;
    const w = canvas.width;
    const h = w;
    const radius = gr * w / 2 * 0.85;
    const a = alpha;
    // If the stone is black or white, draw a circle.
    if (stone.color === 'black' || stone.color === 'white') {
      const color = stone.color === 'black' ? `rgba(0, 0, 0, ${a})` : `rgba(255, 255, 255, ${a})`;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc((stone.x + this.margin + 0.5) * gr * w, (stone.y + this.margin + 0.5) * gr * h, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    }
    // If the stone is symbol, draw a text.
    else {
      ctx.font = `${radius * 1.7}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#F4D99B';
      // ctx.fillStyle = 'black';
      ctx.fillRect((stone.x + this.margin + 0.0625) * gr * w, (stone.y + this.margin + 0.0625) * gr * h, gr * w * 0.85, gr * h * 0.85);
      ctx.fillStyle = 'black';
      ctx.fillText(stone.color, (stone.x + this.margin + 0.5) * gr * w, (stone.y + this.margin + 0.54) * gr * h);
    }

  }

  private _drawStones(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    for (const stone of this.stones) {
      this._drawStone(canvas, ctx, stone, 1.0);
    }
  }

  private _drawMarks(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    for (const branch of this.marks) {
      this._drawStone(canvas, ctx, branch, 1.0);
    }
  }

  // Cursor is a half-transparent stone, indicating the next move.
  private _drawCursor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    if (this.cursor_pos.x < 0 || this.cursor_pos.y < 0) {
      return;
    }
    if (this.cursor_pos.x >= this.size || this.cursor_pos.y >= this.size) {
      return;
    }
    const stone = { x: this.cursor_pos.x, y: this.cursor_pos.y, color: this.current_color };
    this._drawStone(canvas, ctx, stone, 0.3);
  }

  public drawBoard() {
    const canvas = this.shadowRoot?.getElementById('go-board') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    this._drawBoard(canvas, ctx);
    this._drawStones(canvas, ctx);
    this._drawMarks(canvas, ctx);
    this._drawCursor(canvas, ctx);
  }

  get grid_ratio() {
    return 1.0 / (this.size + this.margin * 2);
  }

  private _onClick(e: MouseEvent) {
    const pos = this._calcuatePos(e);
    if (this._findStone(pos.x, pos.y)) {
      return;
    }
    this._putStone(pos.x, pos.y, this.current_color);
    // this.dispatchEvent(new CustomEvent('play-stone'));
    this.drawBoard();

    if (this.current_color === 'black') {
      this.current_color = 'white';
    } else {
      this.current_color = 'black';
    }
  }

  private _calcuatePos(e: MouseEvent) {
    const c = e.target as HTMLCanvasElement;
    const rx = e.offsetX / c.offsetWidth;
    const ry = e.offsetY / c.offsetHeight;
    const grid_x = Math.round((rx / this.grid_ratio) - this.margin - 0.5);
    const grid_y = Math.round((ry / this.grid_ratio) - this.margin - 0.5);
    return { x: grid_x, y: grid_y };
  }

  current_color = 'black';
  cursor_pos = { x: -1, y: -1 };

  private _onLeave() {
    this.cursor_pos = { x: -1, y: -1 };
    this.drawBoard();
  }

  private _onMove(e: MouseEvent) {
    const pos = this._calcuatePos(e);
    if (this._findStone(pos.x, pos.y)) {
      this.cursor_pos = { x: -1, y: -1 };
    } else {
      this.cursor_pos = pos;
    }
    this.drawBoard();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'go-board': GoBoard;
  }
}
