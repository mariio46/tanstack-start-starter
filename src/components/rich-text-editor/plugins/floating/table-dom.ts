import type { LexicalEditor } from 'lexical';

type AnchorRect = { top: number; left: number; width: number; height: number };

function getAnchorRect(element: Element, anchor: HTMLElement): AnchorRect {
    const rect = element.getBoundingClientRect();
    const anchorRect = anchor.getBoundingClientRect();

    return {
        top: rect.top - anchorRect.top + anchor.scrollTop,
        left: rect.left - anchorRect.left + anchor.scrollLeft,
        width: rect.width,
        height: rect.height,
    };
}

function getVisibleTableRect(table: HTMLTableElement, anchor: HTMLElement): AnchorRect {
    const rect = getAnchorRect(table, anchor);
    const wrapper = table.parentElement;
    if (!wrapper || wrapper === anchor || wrapper.scrollWidth <= wrapper.clientWidth) return rect;

    const wrapperRect = getAnchorRect(wrapper, anchor);
    const left = Math.max(rect.left, wrapperRect.left);
    const right = Math.min(rect.left + rect.width, wrapperRect.left + wrapperRect.width);

    return { ...rect, left, width: right - left };
}

function getTableCellFromTarget(editor: LexicalEditor, target: EventTarget | null) {
    if (!(target instanceof Element)) return null;

    const cell = target.closest<HTMLTableCellElement>('td, th');
    const root = editor.getRootElement();
    if (!cell || !root?.contains(cell)) return null;

    return cell;
}

export type { AnchorRect };
export { getAnchorRect, getTableCellFromTarget, getVisibleTableRect };
