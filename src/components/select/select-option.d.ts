import type { CSSResultGroup, TemplateResult } from 'lit';
import type { SelectSize } from './select.js';
import type { FormControlValue } from '@sl-design-system/shared';
import { LitElement } from 'lit';
export declare class SelectOption extends LitElement {
    #private;
    /** @private */
    static styles: CSSResultGroup;
    /** @ignore The size of the select, is set by the select component. */
    size: SelectSize;
    /** @ignore Whether the content of the option item is a node*/
    contentType?: 'string' | 'element';
    /** The value for the option item, to be used in forms.*/
    value?: FormControlValue;
    /** Whether the option item is selected. */
    selected: boolean;
    /** Whether the option item is disabled. */
    disabled: boolean;
    /** @ignore Apply accessible attributes and values to the option. Observe the selected property if it changes */
    protected handleSelectionChange(): void;
    connectedCallback(): void;
    render(): TemplateResult;
}
