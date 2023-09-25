/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * An connector with label between two element.
 *
 * @csspart button - The button
 */
@customElement('labeled-connector')
export class LabeledConnector extends LitElement {
    static override styles = css`
    :host {
      display: block;
      padding: 0px;
    }
    
    .label {
      position: absolute;
      border-radius: 4px;
      padding: 4px;
      background-color: white;
      font-family: sans-serif;
      transform: translate(-50%, -50%);
    }
    
    svg {
        position: absolute;
        top: 0;
        left: 0;
    }
  `;

    constructor() {
        super();
    }

    /// The title of the board.
    @property({ type: String })
    label = '';


    /// The source element.
    /// @type {HTMLElement}
    @property({ type: Object })
    source = null;

    /// The target element.
    /// @type {HTMLElement}
    @property({ type: Object })
    target = null;

    /// The x1 of the line.
    /// @type {number}
    @property({ type: Number })
    x1 = 0;

    /// The y1 of the line.
    /// @type {number}
    @property({ type: Number })
    y1 = 0;

    /// The x2 of the line.
    /// @type {number}
    @property({ type: Number })
    x2 = 100;

    /// The y2 of the line.
    /// @type {number}
    @property({ type: Number })
    y2 = 100;

    override render() {
        return html`
        <svg style="top:${this.y1 - 4};left:${this.x1 - 4};width:${this.x2 - this.x1 + 8}px;height:${this.y2 - this.y1 + 8}px">
            <line x1=4 y1=4 x2="${this.x2 - this.x1 + 4}" y2="${this.y2 - this.y1 + 4}" stroke="black" stroke-width="2" />
        </svg>
        <div class="label" style="top:${this.label_center_y}px;left:${this.label_center_x}px">${this.label}</div>
    `;
    }

    get label_center_x() {
        return (this.x1 + this.x2) / 2;
    }

    get label_center_y() {
        return (this.y1 + this.y2) / 2;
    }

    public update_pos() {
        if (this.source && this.target) {
            this.x1 = this.source.offsetLeft + this.source.offsetWidth / 2;
            this.y1 = this.source.offsetTop + this.source.offsetHeight / 2;
            this.x2 = this.target.offsetLeft + this.target.offsetWidth / 2;
            this.y2 = this.target.offsetTop + this.target.offsetHeight / 2;
        }
    }

}

declare global {
    interface HTMLElementTagNameMap {
        'labeled-connector': LabeledConnector;
    }
}

