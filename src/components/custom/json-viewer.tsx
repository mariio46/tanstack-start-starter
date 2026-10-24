import * as React from 'react';

import { IconCheck, IconChevronRight, IconCopy, IconCopyPlus, IconSearch, IconX } from '@tabler/icons-react';

import { cn } from '@/lib/utils';

interface JsonColorTheme {
    bg: string;
    fg: string;
    key: string;
    string: string;
    number: string;
    boolean: string;
    null: string;
    punctuation: string;
}

const jsonThemes: Record<string, JsonColorTheme> = {
    andromeeda: {
        bg: '#23262E',
        fg: '#D5CED9',
        key: '#00E8C6',
        string: '#96E072',
        number: '#F39C12',
        boolean: '#EE5D43',
        null: '#EE5D43',
        punctuation: '#D5CED9',
    },
    'aurora-x': {
        bg: '#07090F',
        fg: '#bbbbbb',
        key: '#C792EA',
        string: '#C3E88D',
        number: '#F78C6C',
        boolean: '#F78C6C',
        null: '#F78C6C',
        punctuation: '#89DDFF',
    },
    'ayu-dark': {
        bg: '#0d1017',
        fg: '#bfbdb6',
        key: '#39BAE6',
        string: '#AAD94C',
        number: '#D2A6FF',
        boolean: '#D2A6FF',
        null: '#D2A6FF',
        punctuation: '#BFBDB6',
    },
    'ayu-light': {
        bg: '#f8f9fa',
        fg: '#5c6166',
        key: '#55B4D4',
        string: '#86B300',
        number: '#A37ACC',
        boolean: '#A37ACC',
        null: '#A37ACC',
        punctuation: '#5C6166',
    },
    'ayu-mirage': {
        bg: '#1f2430',
        fg: '#cccac2',
        key: '#5CCFE6',
        string: '#D5FF80',
        number: '#DFBFFF',
        boolean: '#DFBFFF',
        null: '#DFBFFF',
        punctuation: '#CCCAC2',
    },
    'catppuccin-frappe': {
        bg: '#303446',
        fg: '#c6d0f5',
        key: '#8CAAEE',
        string: '#A6D189',
        number: '#EF9F76',
        boolean: '#EF9F76',
        null: '#EF9F76',
        punctuation: '#949CBB',
    },
    'catppuccin-latte': {
        bg: '#eff1f5',
        fg: '#4c4f69',
        key: '#1E66F5',
        string: '#40A02B',
        number: '#FE640B',
        boolean: '#FE640B',
        null: '#FE640B',
        punctuation: '#7C7F93',
    },
    'catppuccin-macchiato': {
        bg: '#24273a',
        fg: '#cad3f5',
        key: '#8AADF4',
        string: '#A6DA95',
        number: '#F5A97F',
        boolean: '#F5A97F',
        null: '#F5A97F',
        punctuation: '#939AB7',
    },
    'catppuccin-mocha': {
        bg: '#1e1e2e',
        fg: '#cdd6f4',
        key: '#89B4FA',
        string: '#A6E3A1',
        number: '#FAB387',
        boolean: '#FAB387',
        null: '#FAB387',
        punctuation: '#9399B2',
    },
    'dark-plus': {
        bg: '#1E1E1E',
        fg: '#D4D4D4',
        key: '#9CDCFE',
        string: '#CE9178',
        number: '#B5CEA8',
        boolean: '#569CD6',
        null: '#569CD6',
        punctuation: '#D4D4D4',
    },
    dracula: {
        bg: '#282A36',
        fg: '#F8F8F2',
        key: '#8BE9FD',
        string: '#F1FA8C',
        number: '#BD93F9',
        boolean: '#BD93F9',
        null: '#BD93F9',
        punctuation: '#F8F8F2',
    },
    'dracula-soft': {
        bg: '#282A36',
        fg: '#F8F8F2',
        key: '#8BE9FD',
        string: '#F1FA8C',
        number: '#BD93F9',
        boolean: '#BD93F9',
        null: '#BD93F9',
        punctuation: '#F8F8F2',
    },
    'everforest-dark': {
        bg: '#2D353B',
        fg: '#D3C6AA',
        key: '#7FBBB3',
        string: '#A7C080',
        number: '#D699B6',
        boolean: '#D699B6',
        null: '#D699B6',
        punctuation: '#D3C6AA',
    },
    'everforest-light': {
        bg: '#FDF6E3',
        fg: '#5C6A72',
        key: '#3A94C5',
        string: '#8DA101',
        number: '#DF69BA',
        boolean: '#DF69BA',
        null: '#DF69BA',
        punctuation: '#5C6A72',
    },
    'github-dark': {
        bg: '#24292e',
        fg: '#e1e4e8',
        key: '#79B8FF',
        string: '#9ECBFF',
        number: '#79B8FF',
        boolean: '#79B8FF',
        null: '#79B8FF',
        punctuation: '#E1E4E8',
    },
    'github-dark-default': {
        bg: '#0d1117',
        fg: '#e6edf3',
        key: '#79C0FF',
        string: '#A5D6FF',
        number: '#79C0FF',
        boolean: '#79C0FF',
        null: '#79C0FF',
        punctuation: '#E6EDF3',
    },
    'github-dark-dimmed': {
        bg: '#22272e',
        fg: '#adbac7',
        key: '#6CB6FF',
        string: '#96D0FF',
        number: '#6CB6FF',
        boolean: '#6CB6FF',
        null: '#6CB6FF',
        punctuation: '#ADBAC7',
    },
    'github-dark-high-contrast': {
        bg: '#0a0c10',
        fg: '#f0f3f6',
        key: '#71B7FF',
        string: '#CEE3F8',
        number: '#71B7FF',
        boolean: '#71B7FF',
        null: '#71B7FF',
        punctuation: '#F0F3F6',
    },
    'github-light': {
        bg: '#fff',
        fg: '#24292e',
        key: '#005CC5',
        string: '#032F62',
        number: '#005CC5',
        boolean: '#005CC5',
        null: '#005CC5',
        punctuation: '#24292E',
    },
    'github-light-default': {
        bg: '#ffffff',
        fg: '#1f2328',
        key: '#0550AE',
        string: '#0A3069',
        number: '#0550AE',
        boolean: '#0550AE',
        null: '#0550AE',
        punctuation: '#1F2328',
    },
    'github-light-high-contrast': {
        bg: '#ffffff',
        fg: '#010409',
        key: '#0349B4',
        string: '#0E4F1F',
        number: '#0349B4',
        boolean: '#0349B4',
        null: '#0349B4',
        punctuation: '#010409',
    },
    'gruvbox-dark-hard': {
        bg: '#1d2021',
        fg: '#ebdbb2',
        key: '#83A598',
        string: '#B8BB26',
        number: '#D3869B',
        boolean: '#D3869B',
        null: '#D3869B',
        punctuation: '#EBDBB2',
    },
    'gruvbox-dark-medium': {
        bg: '#282828',
        fg: '#ebdbb2',
        key: '#83A598',
        string: '#B8BB26',
        number: '#D3869B',
        boolean: '#D3869B',
        null: '#D3869B',
        punctuation: '#EBDBB2',
    },
    'gruvbox-dark-soft': {
        bg: '#32302f',
        fg: '#ebdbb2',
        key: '#83A598',
        string: '#B8BB26',
        number: '#D3869B',
        boolean: '#D3869B',
        null: '#D3869B',
        punctuation: '#EBDBB2',
    },
    'gruvbox-light-hard': {
        bg: '#f9f5d7',
        fg: '#3c3836',
        key: '#427B58',
        string: '#79740E',
        number: '#8F3F71',
        boolean: '#8F3F71',
        null: '#8F3F71',
        punctuation: '#3C3836',
    },
    'gruvbox-light-medium': {
        bg: '#fbf1c7',
        fg: '#3c3836',
        key: '#427B58',
        string: '#79740E',
        number: '#8F3F71',
        boolean: '#8F3F71',
        null: '#8F3F71',
        punctuation: '#3C3836',
    },
    'gruvbox-light-soft': {
        bg: '#f2e5bc',
        fg: '#3c3836',
        key: '#427B58',
        string: '#79740E',
        number: '#8F3F71',
        boolean: '#8F3F71',
        null: '#8F3F71',
        punctuation: '#3C3836',
    },
    horizon: {
        bg: '#1C1E26',
        fg: '#D5D8DA',
        key: '#E95678',
        string: '#FAB795',
        number: '#F09483',
        boolean: '#F09483',
        null: '#F09483',
        punctuation: '#BBBBBB',
    },
    'horizon-bright': {
        bg: '#FDF0ED',
        fg: '#403C3D',
        key: '#DA103F',
        string: '#A86B00',
        number: '#F58C00',
        boolean: '#F58C00',
        null: '#F58C00',
        punctuation: '#403C3D',
    },
    houston: {
        bg: '#17191e',
        fg: '#eee8d5',
        key: '#4bf3c8',
        string: '#fedc56',
        number: '#6acff1',
        boolean: '#6acff1',
        null: '#6acff1',
        punctuation: '#EEE8D5',
    },
    'kanagawa-dragon': {
        bg: '#181616',
        fg: '#c5c9c5',
        key: '#87a987',
        string: '#98bb6c',
        number: '#d27e99',
        boolean: '#d27e99',
        null: '#d27e99',
        punctuation: '#9E9B93',
    },
    'kanagawa-lotus': {
        bg: '#f2ecbc',
        fg: '#545464',
        key: '#6693bf',
        string: '#6f894e',
        number: '#b35b79',
        boolean: '#b35b79',
        null: '#b35b79',
        punctuation: '#8A8980',
    },
    'kanagawa-wave': {
        bg: '#1f1f28',
        fg: '#dcd7ba',
        key: '#7e9cd8',
        string: '#98bb6c',
        number: '#d27e99',
        boolean: '#d27e99',
        null: '#d27e99',
        punctuation: '#9A9A82',
    },
    laserwave: {
        bg: '#27212E',
        fg: '#FFFFFF',
        key: '#40B4C4',
        string: '#FFE261',
        number: '#B381C5',
        boolean: '#B381C5',
        null: '#B381C5',
        punctuation: '#FFFFFF',
    },
    'light-plus': {
        bg: '#FFFFFF',
        fg: '#000000',
        key: '#0451A5',
        string: '#A31515',
        number: '#098658',
        boolean: '#0000FF',
        null: '#0000FF',
        punctuation: '#000000',
    },
    'material-theme': {
        bg: '#263238',
        fg: '#EEFFFF',
        key: '#F78C6C',
        string: '#C3E88D',
        number: '#F78C6C',
        boolean: '#89DDFF',
        null: '#89DDFF',
        punctuation: '#89DDFF',
    },
    'material-theme-darker': {
        bg: '#212121',
        fg: '#EEFFFF',
        key: '#F78C6C',
        string: '#C3E88D',
        number: '#F78C6C',
        boolean: '#89DDFF',
        null: '#89DDFF',
        punctuation: '#89DDFF',
    },
    'material-theme-lighter': {
        bg: '#FAFAFA',
        fg: '#90A4AE',
        key: '#F76D47',
        string: '#91B859',
        number: '#F76D47',
        boolean: '#39ADB5',
        null: '#39ADB5',
        punctuation: '#39ADB5',
    },
    'material-theme-ocean': {
        bg: '#0F111A',
        fg: '#BABED8',
        key: '#F78C6C',
        string: '#C3E88D',
        number: '#F78C6C',
        boolean: '#89DDFF',
        null: '#89DDFF',
        punctuation: '#89DDFF',
    },
    'material-theme-palenight': {
        bg: '#292D3E',
        fg: '#BABED8',
        key: '#F78C6C',
        string: '#C3E88D',
        number: '#F78C6C',
        boolean: '#89DDFF',
        null: '#89DDFF',
        punctuation: '#89DDFF',
    },
    'min-dark': {
        bg: '#1f1f1f',
        fg: '#b392f0',
        key: '#79B8FF',
        string: '#FFAB70',
        number: '#F8F8F8',
        boolean: '#F8F8F8',
        null: '#F8F8F8',
        punctuation: '#B392F0',
    },
    'min-light': {
        bg: '#ffffff',
        fg: '#24292eff',
        key: '#005CC5',
        string: '#22863A',
        number: '#005CC5',
        boolean: '#005CC5',
        null: '#005CC5',
        punctuation: '#24292EFF',
    },
    monokai: {
        bg: '#272822',
        fg: '#F8F8F2',
        key: '#66D9EF',
        string: '#CFCFC2',
        number: '#AE81FF',
        boolean: '#AE81FF',
        null: '#AE81FF',
        punctuation: '#F8F8F2',
    },
    'night-owl': {
        bg: '#011627',
        fg: '#d6deeb',
        key: '#7FDBCA',
        string: '#ECC48D',
        number: '#F78C6C',
        boolean: '#FF5874',
        null: '#FF5874',
        punctuation: '#7FDBCA',
    },
    'night-owl-light': {
        bg: '#FBFBFB',
        fg: '#403f53',
        key: '#0C969B',
        string: '#C96765',
        number: '#AA0982',
        boolean: '#BC5454',
        null: '#BC5454',
        punctuation: '#0C969B',
    },
    nord: {
        bg: '#2e3440ff',
        fg: '#d8dee9ff',
        key: '#8FBCBB',
        string: '#A3BE8C',
        number: '#B48EAD',
        boolean: '#81A1C1',
        null: '#81A1C1',
        punctuation: '#ECEFF4',
    },
    'one-dark-pro': {
        bg: '#282c34',
        fg: '#abb2bf',
        key: '#E06C75',
        string: '#98C379',
        number: '#D19A66',
        boolean: '#D19A66',
        null: '#D19A66',
        punctuation: '#ABB2BF',
    },
    'one-light': {
        bg: '#FAFAFA',
        fg: '#383A42',
        key: '#E45649',
        string: '#50A14F',
        number: '#986801',
        boolean: '#986801',
        null: '#986801',
        punctuation: '#383A42',
    },
    plastic: {
        bg: '#21252B',
        fg: '#A9B2C3',
        key: '#E06C75',
        string: '#98C379',
        number: '#D19A66',
        boolean: '#56B6C2',
        null: '#56B6C2',
        punctuation: '#A9B2C3',
    },
    poimandres: {
        bg: '#1b1e28',
        fg: '#a6accd',
        key: '#5DE4C7',
        string: '#A6ACCD',
        number: '#5DE4C7',
        boolean: '#5DE4C7',
        null: '#5DE4C7',
        punctuation: '#A6ACCD',
    },
    red: {
        bg: '#390000',
        fg: '#F8F8F8',
        key: '#F8F8F8',
        string: '#FE6262',
        number: '#FF9D9D',
        boolean: '#FF9D9D',
        null: '#FF9D9D',
        punctuation: '#F8F8F8',
    },
    'rose-pine': {
        bg: '#191724',
        fg: '#e0def4',
        key: '#9CCFD8',
        string: '#F6C177',
        number: '#EB6F92',
        boolean: '#31748F',
        null: '#31748F',
        punctuation: '#908CAA',
    },
    'rose-pine-dawn': {
        bg: '#faf4ed',
        fg: '#575279',
        key: '#56949F',
        string: '#EA9D34',
        number: '#B4637A',
        boolean: '#286983',
        null: '#286983',
        punctuation: '#797593',
    },
    'rose-pine-moon': {
        bg: '#232136',
        fg: '#e0def4',
        key: '#9CCFD8',
        string: '#F6C177',
        number: '#EB6F92',
        boolean: '#3E8FB0',
        null: '#3E8FB0',
        punctuation: '#908CAA',
    },
    'slack-dark': {
        bg: '#222222',
        fg: '#E6E6E6',
        key: '#78AF9F',
        string: '#F69D50',
        number: '#E9A362',
        boolean: '#7DB3DE',
        null: '#7DB3DE',
        punctuation: '#E6E6E6',
    },
    'slack-ochin': {
        bg: '#FFFFFF',
        fg: '#002339',
        key: '#B3694D',
        string: '#4F9062',
        number: '#174781',
        boolean: '#174781',
        null: '#174781',
        punctuation: '#002339',
    },
    'snazzy-light': {
        bg: '#FAFBFC',
        fg: '#565869',
        key: '#D8366D',
        string: '#2D9B27',
        number: '#E06011',
        boolean: '#D8366D',
        null: '#D8366D',
        punctuation: '#565869',
    },
    'solarized-dark': {
        bg: '#002B36',
        fg: '#839496',
        key: '#859900',
        string: '#2AA198',
        number: '#D33682',
        boolean: '#B58900',
        null: '#B58900',
        punctuation: '#839496',
    },
    'solarized-light': {
        bg: '#FDF6E3',
        fg: '#657B83',
        key: '#859900',
        string: '#2AA198',
        number: '#D33682',
        boolean: '#B58900',
        null: '#B58900',
        punctuation: '#657B83',
    },
    'synthwave-84': {
        bg: '#262335',
        fg: '#BBBBBB',
        key: '#FF7EDB',
        string: '#FF8B39',
        number: '#F97E72',
        boolean: '#F97E72',
        null: '#F97E72',
        punctuation: '#BBBBBB',
    },
    'tokyo-night': {
        bg: '#1a1b26',
        fg: '#a9b1d6',
        key: '#7AA2F7',
        string: '#9ECE6A',
        number: '#FF9E64',
        boolean: '#FF9E64',
        null: '#FF9E64',
        punctuation: '#A9B1D6',
    },
    vesper: {
        bg: '#101010',
        fg: '#b1b1b1',
        key: '#FFC799',
        string: '#99FFE4',
        number: '#FFC799',
        boolean: '#FFC799',
        null: '#FFC799',
        punctuation: '#B1B1B1',
    },
    'vitesse-black': {
        bg: '#000000',
        fg: '#dbd7caee',
        key: '#4D9375',
        string: '#C98A7D',
        number: '#4C9A91',
        boolean: '#4D9375',
        null: '#4D9375',
        punctuation: '#666666',
    },
    'vitesse-dark': {
        bg: '#121212',
        fg: '#dbd7caee',
        key: '#4D9375',
        string: '#C98A7D',
        number: '#4C9A91',
        boolean: '#4D9375',
        null: '#4D9375',
        punctuation: '#666666',
    },
    'vitesse-light': {
        bg: '#ffffff',
        fg: '#393a34',
        key: '#1E754F',
        string: '#B5695999',
        number: '#2F798A',
        boolean: '#1E754F',
        null: '#1E754F',
        punctuation: '#999999',
    },
};

type ShikiThemeName = keyof typeof jsonThemes;

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

const ThemeContext = React.createContext<JsonColorTheme | null>(null);

function useThemeColors(): JsonColorTheme | null {
    return React.use(ThemeContext);
}

function typeOf(value: JsonValue): string {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
}

function countEntries(value: JsonValue): number {
    if (Array.isArray(value)) return value.length;
    if (value !== null && typeof value === 'object') return Object.keys(value).length;
    return 0;
}

function buildPath(parent: string, key: string | number): string {
    if (parent === '') return String(key);
    if (typeof key === 'number') return `${parent}[${key}]`;
    if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)) return `${parent}.${key}`;
    return `${parent}["${key}"]`;
}

function matchesSearch(key: string | number, value: JsonValue, query: string): boolean {
    const q = query.toLowerCase();
    if (String(key).toLowerCase().includes(q)) return true;
    if (value === null) return 'null'.includes(q);
    if (typeof value !== 'object') return String(value).toLowerCase().includes(q);
    return false;
}

function hasSearchMatch(value: JsonValue, key: string | number, query: string): boolean {
    if (!query) return false;
    if (matchesSearch(key, value, query)) return true;
    if (value !== null && typeof value === 'object') {
        const entries = Array.isArray(value) ? value.map((v, i) => [i, v] as const) : Object.entries(value);
        return entries.some(([k, v]) => hasSearchMatch(v, k, query));
    }
    return false;
}

function TokenSpan({
    token,
    children,
    className,
    italic,
}: {
    token: keyof JsonColorTheme;
    children: React.ReactNode;
    className?: string;
    italic?: boolean;
}) {
    const theme = useThemeColors();

    if (theme) {
        return (
            <span style={{ color: theme[token], fontStyle: italic ? 'italic' : undefined }} className={className}>
                {children}
            </span>
        );
    }

    const fallbackMap: Record<string, string> = {
        key: 'text-violet-600 dark:text-violet-400',
        string: 'text-emerald-600 dark:text-emerald-400',
        number: 'text-sky-600 dark:text-sky-400',
        boolean: 'text-amber-600 dark:text-amber-400',
        null: 'text-muted-foreground/60',
        punctuation: 'text-muted-foreground',
        fg: '',
        bg: '',
    };

    return <span className={cn(fallbackMap[token], italic && 'italic', className)}>{children}</span>;
}

function HighlightMatch({ text, query }: { text: string; query: string }) {
    if (!query) return <>{text}</>;

    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return <>{text}</>;

    return (
        <>
            {text.slice(0, idx)}
            <mark className='rounded-sm bg-amber-200/60 px-0.5 text-inherit dark:bg-amber-500/30'>
                {text.slice(idx, idx + query.length)}
            </mark>
            {text.slice(idx + query.length)}
        </>
    );
}

interface JsonNodeProps {
    keyName: string | number;
    value: JsonValue;
    path: string;
    depth: number;
    defaultExpanded: number | true;
    searchQuery: string;
    collapsedPaths: Set<string>;
    onToggle: (path: string) => void;
    isLast: boolean;
}

function JsonNode({
    keyName,
    value,
    path,
    depth,
    defaultExpanded,
    searchQuery,
    collapsedPaths,
    onToggle,
    isLast,
}: JsonNodeProps) {
    const theme = useThemeColors();
    const type = typeOf(value);
    const isExpandable = type === 'object' || type === 'array';
    const count = isExpandable ? countEntries(value) : 0;

    const isCollapsed = collapsedPaths.has(path);
    const isExpanded = isExpandable && !isCollapsed;

    const openBracket = type === 'array' ? '[' : '{';
    const closeBracket = type === 'array' ? ']' : '}';
    const comma = isLast ? '' : ',';

    const nodeMatches = searchQuery && matchesSearch(keyName, value, searchQuery);

    const handleToggle = React.useCallback(() => {
        if (isExpandable) onToggle(path);
    }, [isExpandable, onToggle, path]);

    const [pathCopied, setPathCopied] = React.useState(false);

    const handleCopyPath = React.useCallback(() => {
        navigator.clipboard.writeText(path).then(() => {
            setPathCopied(true);
            setTimeout(() => setPathCopied(false), 1500);
        });
    }, [path]);

    const hoverBg = theme ? `${theme.fg}10` : undefined;

    const rowClass = cn(
        'group flex items-center gap-0 py-px',
        !theme && 'hover:bg-muted/40',
        !theme && nodeMatches && 'bg-amber-100/40 dark:bg-amber-900/20',
    );

    const rowStyle: React.CSSProperties = {
        paddingLeft: `${depth * 20 + 8}px`,
        ...(theme && nodeMatches ? { backgroundColor: `${theme.fg}15` } : {}),
    };

    const copyIconClass = cn(
        'ml-1 inline-flex items-center justify-center rounded p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        theme
            ? 'opacity-0 group-hover:opacity-60 hover:opacity-100!'
            : 'text-muted-foreground/0 group-hover:text-muted-foreground hover:text-foreground! focus-visible:text-muted-foreground',
    );

    function renderKey() {
        return (
            <TokenSpan token='key'>
                {typeof keyName === 'string' ? (
                    <>
                        &quot;
                        <HighlightMatch text={keyName} query={searchQuery} />
                        &quot;
                    </>
                ) : (
                    keyName
                )}
            </TokenSpan>
        );
    }

    function renderValue() {
        if (typeof value === 'string') {
            return (
                <TokenSpan token='string'>
                    &quot;
                    <HighlightMatch text={value} query={searchQuery} />
                    &quot;
                </TokenSpan>
            );
        }
        if (value === null) {
            return (
                <TokenSpan token='null' italic>
                    {searchQuery ? <HighlightMatch text='null' query={searchQuery} /> : 'null'}
                </TokenSpan>
            );
        }
        if (typeof value === 'number') {
            return (
                <TokenSpan token='number'>
                    <HighlightMatch text={String(value)} query={searchQuery} />
                </TokenSpan>
            );
        }
        if (typeof value === 'boolean') {
            return (
                <TokenSpan token='boolean'>
                    <HighlightMatch text={String(value)} query={searchQuery} />
                </TokenSpan>
            );
        }
        return <span>{String(value)}</span>;
    }

    if (!isExpandable) {
        return (
            <div
                className={rowClass}
                style={rowStyle}
                onMouseEnter={
                    theme
                        ? (e) => {
                              e.currentTarget.style.backgroundColor = hoverBg ?? '';
                          }
                        : undefined
                }
                onMouseLeave={
                    theme
                        ? (e) => {
                              e.currentTarget.style.backgroundColor = nodeMatches ? `${theme.fg}15` : '';
                          }
                        : undefined
                }
            >
                <span className='w-4 shrink-0' />
                <span className='font-mono text-xs'>
                    {renderKey()}
                    <TokenSpan token='punctuation'>: </TokenSpan>
                    {renderValue()}
                    <TokenSpan token='punctuation'>{comma}</TokenSpan>
                </span>
                <button
                    type='button'
                    onClick={handleCopyPath}
                    aria-label={`Salin path: ${path}`}
                    className={copyIconClass}
                    style={theme ? { color: theme.fg } : undefined}
                >
                    {pathCopied ? (
                        <IconCopyPlus className='size-3 text-emerald-500' />
                    ) : (
                        <IconCopyPlus className='size-3' />
                    )}
                </button>
            </div>
        );
    }

    const entries = Array.isArray(value)
        ? value.map((v, i) => [i, v] as [number, JsonValue])
        : (Object.entries(value as Record<string, JsonValue>) as [string, JsonValue][]);

    const filteredEntries = searchQuery ? entries.filter(([k, v]) => hasSearchMatch(v, k, searchQuery)) : entries;
    const showAll = !searchQuery;
    const displayEntries = showAll ? entries : filteredEntries;

    return (
        <div>
            <div
                className={rowClass}
                style={rowStyle}
                onMouseEnter={
                    theme
                        ? (e) => {
                              e.currentTarget.style.backgroundColor = hoverBg ?? '';
                          }
                        : undefined
                }
                onMouseLeave={
                    theme
                        ? (e) => {
                              e.currentTarget.style.backgroundColor = nodeMatches ? `${theme.fg}15` : '';
                          }
                        : undefined
                }
            >
                <button
                    type='button'
                    onClick={handleToggle}
                    aria-label={isExpanded ? 'Ciutkan' : 'Bentangkan'}
                    className='flex size-4 shrink-0 items-center justify-center transition-transform'
                    style={theme ? { color: theme.punctuation } : undefined}
                >
                    <IconChevronRight
                        className={cn(
                            'size-3 transition-transform',
                            isExpanded && 'rotate-90',
                            !theme && 'text-muted-foreground',
                        )}
                    />
                </button>
                <span className='font-mono text-xs'>
                    {renderKey()}
                    <TokenSpan token='punctuation'>: </TokenSpan>
                    <TokenSpan token='punctuation'>{openBracket}</TokenSpan>
                    {!isExpanded && (
                        <>
                            <span
                                className={cn('mx-1 text-[10px]', !theme && 'text-muted-foreground/60')}
                                style={theme ? { color: `${theme.fg}60` } : undefined}
                            >
                                {count} item
                            </span>
                            <TokenSpan token='punctuation'>
                                {closeBracket}
                                {comma}
                            </TokenSpan>
                        </>
                    )}
                </span>
                <button
                    type='button'
                    onClick={handleCopyPath}
                    aria-label={`Salin path: ${path}`}
                    className={copyIconClass}
                    style={theme ? { color: theme.fg } : undefined}
                >
                    {pathCopied ? (
                        <IconCopyPlus className='size-3 text-emerald-500' />
                    ) : (
                        <IconCopyPlus className='size-3' />
                    )}
                </button>
            </div>

            {isExpanded && (
                <>
                    {displayEntries.map(([k, v], i) => (
                        <JsonNode
                            key={`${k}-${i}`}
                            keyName={k}
                            value={v}
                            path={buildPath(path, k)}
                            depth={depth + 1}
                            defaultExpanded={defaultExpanded}
                            searchQuery={searchQuery}
                            collapsedPaths={collapsedPaths}
                            onToggle={onToggle}
                            isLast={i === displayEntries.length - 1}
                        />
                    ))}
                    <div
                        className={cn('font-mono text-xs', !theme && 'text-muted-foreground')}
                        style={{
                            paddingLeft: `${depth * 20 + 8 + 16}px`,
                            ...(theme ? { color: theme.punctuation } : {}),
                        }}
                    >
                        {closeBracket}
                        {comma}
                    </div>
                </>
            )}
        </div>
    );
}

function collectPaths(
    value: JsonValue,
    path: string,
    maxDepth: number | true,
    depth: number,
    result: Set<string>,
): void {
    if (value === null || typeof value !== 'object') return;
    if (maxDepth !== true && depth >= maxDepth) {
        result.add(path);
    }
    const entries = Array.isArray(value) ? value.map((v, i) => [i, v] as const) : Object.entries(value);
    for (const [k, v] of entries) {
        collectPaths(v, buildPath(path, k), maxDepth, depth + 1, result);
    }
}

function allExpandablePaths(value: JsonValue, rootName: string): Set<string> {
    const result = new Set<string>();
    collectAllExpandable(value, rootName, result);
    return result;
}

function collectAllExpandable(value: JsonValue, path: string, result: Set<string>): void {
    if (value === null || typeof value !== 'object') return;
    result.add(path);
    const entries = Array.isArray(value) ? value.map((v, i) => [i, v] as const) : Object.entries(value);
    for (const [k, v] of entries) {
        collectAllExpandable(v, buildPath(path, k), result);
    }
}

function resolveTheme(theme: ShikiThemeName | JsonColorTheme | undefined): JsonColorTheme | null {
    if (!theme) return null;
    if (typeof theme === 'string') return jsonThemes[theme] ?? null;
    return theme;
}

interface JsonViewerProps extends Omit<React.ComponentProps<'div'>, 'children' | 'title'> {
    data: JsonValue;
    title?: string;
    rootName?: string;
    defaultExpanded?: number | true;
    colorTheme?: ShikiThemeName | JsonColorTheme;
}

function JsonViewer({
    data,
    title,
    rootName = 'root',
    defaultExpanded = 1,
    colorTheme,
    className,
    ...props
}: JsonViewerProps) {
    const resolved = resolveTheme(colorTheme);

    const [collapsedPaths, setCollapsedPaths] = React.useState<Set<string>>(() => {
        if (defaultExpanded === true) return new Set();
        const collapsed = new Set<string>();
        collectPaths(data, rootName, defaultExpanded, 0, collapsed);
        return collapsed;
    });
    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchOpen, setSearchOpen] = React.useState(false);
    const [copiedAll, setCopiedAll] = React.useState(false);
    const searchRef = React.useRef<HTMLInputElement>(null);

    const togglePath = React.useCallback((path: string) => {
        setCollapsedPaths((prev) => {
            const next = new Set(prev);
            if (next.has(path)) {
                next.delete(path);
            } else {
                next.add(path);
            }
            return next;
        });
    }, []);

    const expandAll = React.useCallback(() => {
        setCollapsedPaths(new Set());
    }, []);

    const collapseAll = React.useCallback(() => {
        const all = allExpandablePaths(data, rootName);
        setCollapsedPaths(all);
    }, [data, rootName]);

    const copyJson = React.useCallback(() => {
        navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
            setCopiedAll(true);
            setTimeout(() => setCopiedAll(false), 1500);
        });
    }, [data]);

    const toggleSearch = React.useCallback(() => {
        setSearchOpen((prev) => {
            if (!prev) {
                requestAnimationFrame(() => searchRef.current?.focus());
            } else {
                setSearchQuery('');
            }
            return !prev;
        });
    }, []);

    React.useEffect(() => {
        if (searchQuery) {
            setCollapsedPaths(new Set());
        }
    }, [searchQuery]);

    const isExpandable = data !== null && typeof data === 'object';
    const type = typeOf(data);

    return (
        <ThemeContext value={resolved}>
            <div
                data-slot='json-viewer'
                className={cn('overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm', className)}
                {...props}
            >
                <div className='flex items-center justify-between border-b border-border/40 px-3 py-2 sm:px-4'>
                    <div className='flex items-center gap-2'>
                        {title && <h3 className='text-sm font-semibold text-foreground'>{title}</h3>}
                        {isExpandable && (
                            <span className='rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground'>
                                {countEntries(data)} {type === 'array' ? 'item' : 'key'}
                            </span>
                        )}
                    </div>
                    <div className='flex items-center gap-0.5'>
                        <button
                            type='button'
                            onClick={toggleSearch}
                            aria-label={searchOpen ? 'Tutup pencarian' : 'Cari'}
                            className={cn(
                                'inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                searchOpen && 'bg-muted text-foreground',
                            )}
                        >
                            <IconSearch className='size-3.5' />
                        </button>
                        <button
                            type='button'
                            onClick={expandAll}
                            aria-label='Bentangkan semua'
                            className='inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='24'
                                height='24'
                                fill='none'
                                stroke='currentColor'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                className='size-3.5'
                                viewBox='0 0 24 24'
                            >
                                <path d='M16 12h6M8 12H2M12 2v2M12 8v2M12 14v2M12 20v2M19 15l3-3-3-3M5 9l-3 3 3 3'></path>
                            </svg>
                        </button>
                        <button
                            type='button'
                            onClick={collapseAll}
                            aria-label='Ciutkan semua'
                            className='inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='24'
                                height='24'
                                fill='none'
                                stroke='currentColor'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                className='size-3.5'
                                viewBox='0 0 24 24'
                            >
                                <path d='M2 12h6M22 12h-6M12 2v2M12 8v2M12 14v2M12 20v2M19 9l-3 3 3 3M5 15l3-3-3-3'></path>
                            </svg>
                        </button>
                        <button
                            type='button'
                            onClick={copyJson}
                            aria-label='Salin JSON'
                            className='inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                        >
                            {copiedAll ? (
                                <IconCheck className='size-3.5 text-emerald-500' />
                            ) : (
                                <IconCopy className='size-3.5' />
                            )}
                        </button>
                    </div>
                </div>

                {searchOpen && (
                    <div className='flex items-center gap-2 border-b border-border/40 bg-muted/20 px-3 py-1.5 sm:px-4'>
                        <IconSearch className='size-3.5 shrink-0 text-muted-foreground' />
                        <input
                            ref={searchRef}
                            type='text'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder='Filter key dan value…'
                            className='min-w-0 flex-1 bg-transparent font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none'
                        />
                        {searchQuery && (
                            <button
                                type='button'
                                onClick={() => setSearchQuery('')}
                                aria-label='Hapus pencarian'
                                className='inline-flex items-center justify-center rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground'
                            >
                                <IconX className='size-3' />
                            </button>
                        )}
                    </div>
                )}

                <div
                    className='overflow-auto py-1'
                    style={
                        resolved
                            ? {
                                  backgroundColor: resolved.bg,
                                  color: resolved.fg,
                              }
                            : undefined
                    }
                >
                    {isExpandable ? (
                        <JsonNode
                            keyName={rootName}
                            value={data}
                            path={rootName}
                            depth={0}
                            defaultExpanded={defaultExpanded}
                            searchQuery={searchQuery}
                            collapsedPaths={collapsedPaths}
                            onToggle={togglePath}
                            isLast
                        />
                    ) : (
                        <div className='px-4 py-2 font-mono text-xs'>
                            <TokenSpan token='key'>{rootName}</TokenSpan>
                            <TokenSpan token='punctuation'>: </TokenSpan>
                            {typeof data === 'string' ? (
                                <TokenSpan token='string'>&quot;{data}&quot;</TokenSpan>
                            ) : typeof data === 'number' ? (
                                <TokenSpan token='number'>{String(data)}</TokenSpan>
                            ) : typeof data === 'boolean' ? (
                                <TokenSpan token='boolean'>{String(data)}</TokenSpan>
                            ) : (
                                <TokenSpan token='null' italic>
                                    null
                                </TokenSpan>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </ThemeContext>
    );
}

export { type JsonValue, JsonViewer, type JsonViewerProps };
