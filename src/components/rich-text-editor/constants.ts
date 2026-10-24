import type { LinkMatcher } from '@lexical/link';
import { autoLinkEmailMatcher, autoLinkUrlMatcher } from '@lexical/link';
import {
    IconBlockquote,
    IconCode,
    IconH1,
    IconH2,
    IconH3,
    IconH4,
    IconH5,
    IconH6,
    IconList,
    IconListCheck,
    IconListNumbers,
    IconPilcrow,
} from '@tabler/icons-react';
import type { KeyboardShortcutMatch } from 'lexical';
import { CONTROL_OR_META, IS_APPLE } from 'lexical';

import type { BlockType } from '@/components/rich-text-editor/extensions/format-state';

const MAX_LIST_INDENT = 7;

const BLOCK_TYPES: { value: BlockType; label: string; icon: typeof IconPilcrow }[] = [
    { value: 'paragraph', label: 'Paragraf', icon: IconPilcrow },
    { value: 'h1', label: 'Heading 1', icon: IconH1 },
    { value: 'h2', label: 'Heading 2', icon: IconH2 },
    { value: 'h3', label: 'Heading 3', icon: IconH3 },
    { value: 'h4', label: 'Heading 4', icon: IconH4 },
    { value: 'h5', label: 'Heading 5', icon: IconH5 },
    { value: 'h6', label: 'Heading 6', icon: IconH6 },
    { value: 'bullet', label: 'Daftar berpoin', icon: IconList },
    { value: 'number', label: 'Daftar bernomor', icon: IconListNumbers },
    { value: 'check', label: 'Daftar centang', icon: IconListCheck },
    { value: 'quote', label: 'Kutipan', icon: IconBlockquote },
    { value: 'code', label: 'Code block', icon: IconCode },
];

const CODE_TAB_SIZE = 2;

const FONT_FAMILIES: { label: string; value: string }[] = [
    { label: 'Bawaan', value: '' },
    { label: 'Geist', value: 'Geist Variable' },
    { label: 'Outfit', value: 'Outfit Variable' },
    { label: 'Arial', value: 'Arial' },
    { label: 'Georgia', value: 'Georgia' },
    { label: 'Times New Roman', value: 'Times New Roman' },
    { label: 'Courier New', value: 'Courier New' },
    { label: 'Verdana', value: 'Verdana' },
];

const FONT_SIZE_MIN = 8;
const FONT_SIZE_MAX = 72;
const FONT_SIZE_DEFAULT = 16;

const COLOR_SWATCHES: { label: string; value: string }[] = [
    { label: 'Hitam', value: '#000000' },
    { label: 'Abu-abu', value: '#6b7280' },
    { label: 'Perak', value: '#d1d5db' },
    { label: 'Putih', value: '#ffffff' },
    { label: 'Merah', value: '#ef4444' },
    { label: 'Oranye', value: '#f97316' },
    { label: 'Ambar', value: '#f59e0b' },
    { label: 'Kuning', value: '#eab308' },
    { label: 'Hijau muda', value: '#84cc16' },
    { label: 'Hijau', value: '#22c55e' },
    { label: 'Toska', value: '#14b8a6' },
    { label: 'Sian', value: '#06b6d4' },
    { label: 'Biru', value: '#3b82f6' },
    { label: 'Nila', value: '#6366f1' },
    { label: 'Ungu', value: '#a855f7' },
    { label: 'Merah muda', value: '#ec4899' },
];

const TABLE_DEFAULT_ROWS = 3;
const TABLE_DEFAULT_COLUMNS = 3;
const TABLE_MAX_ROWS = 50;
const TABLE_MAX_COLUMNS = 12;
const TABLE_MIN_COLUMN_WIDTH = 96;
const TABLE_MIN_ROW_HEIGHT = 40;

const IMAGE_ACCEPT = 'image/*';
const IMAGE_MAX_SIZE = 5 * 1024 * 1024;
const IMAGE_MAX_WIDTH = 800;
const IMAGE_MIN_WIDTH = 48;

const COLUMN_LAYOUTS: { label: string; value: string }[] = [
    { label: '2 kolom (lebar sama)', value: '1fr 1fr' },
    { label: '2 kolom (25% / 75%)', value: '1fr 3fr' },
    { label: '2 kolom (75% / 25%)', value: '3fr 1fr' },
    { label: '3 kolom (lebar sama)', value: '1fr 1fr 1fr' },
    { label: '3 kolom (25% / 50% / 25%)', value: '1fr 2fr 1fr' },
    { label: '4 kolom (lebar sama)', value: '1fr 1fr 1fr 1fr' },
];

type DocumentFormat = 'json' | 'markdown' | 'html';

const DOCUMENT_IMPORT_FORMATS: Record<string, DocumentFormat> = {
    json: 'json',
    lexical: 'json',
    md: 'markdown',
    markdown: 'markdown',
    html: 'html',
    htm: 'html',
};
const DOCUMENT_IMPORT_ACCEPT = Object.keys(DOCUMENT_IMPORT_FORMATS)
    .map((extension) => `.${extension}`)
    .join(',');
const DOCUMENT_EXPORT_FILE_NAME = 'dokumen';

const AUTO_LINK_MATCHERS: LinkMatcher[] = [autoLinkUrlMatcher, autoLinkEmailMatcher];

const LINK_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'];

const MENTION_SEARCH_DELAY = 200;
const MENTION_MAX_QUERY_LENGTH = 32;
const MENTION_MENU_LIMIT = 8;

type Emoji = { emoji: string; name: string; keywords: string[] };

const EMOJIS: Emoji[] = [
    { emoji: '😀', name: 'grinning', keywords: ['smile', 'happy', 'face'] },
    { emoji: '😃', name: 'smiley', keywords: ['smile', 'happy', 'joy'] },
    { emoji: '😄', name: 'smile', keywords: ['happy', 'joy', 'laugh'] },
    { emoji: '😁', name: 'grin', keywords: ['smile', 'teeth', 'happy'] },
    { emoji: '😆', name: 'laughing', keywords: ['happy', 'haha', 'lol'] },
    { emoji: '😅', name: 'sweat_smile', keywords: ['relief', 'nervous', 'phew'] },
    { emoji: '🤣', name: 'rofl', keywords: ['lol', 'laugh', 'floor'] },
    { emoji: '😂', name: 'joy', keywords: ['tears', 'laugh', 'lol'] },
    { emoji: '🙂', name: 'slightly_smiling', keywords: ['smile', 'ok'] },
    { emoji: '🙃', name: 'upside_down', keywords: ['silly', 'sarcasm'] },
    { emoji: '😉', name: 'wink', keywords: ['flirt', 'joke'] },
    { emoji: '😊', name: 'blush', keywords: ['smile', 'shy', 'happy'] },
    { emoji: '😇', name: 'innocent', keywords: ['angel', 'halo'] },
    { emoji: '🥰', name: 'smiling_hearts', keywords: ['love', 'adore', 'crush'] },
    { emoji: '😍', name: 'heart_eyes', keywords: ['love', 'crush', 'like'] },
    { emoji: '🤩', name: 'star_struck', keywords: ['wow', 'amazing', 'excited'] },
    { emoji: '😘', name: 'kissing_heart', keywords: ['kiss', 'love'] },
    { emoji: '😋', name: 'yum', keywords: ['tasty', 'delicious', 'food'] },
    { emoji: '😛', name: 'tongue', keywords: ['playful', 'silly'] },
    { emoji: '😜', name: 'winking_tongue', keywords: ['crazy', 'silly', 'joke'] },
    { emoji: '🤪', name: 'zany', keywords: ['crazy', 'goofy', 'wild'] },
    { emoji: '🤗', name: 'hugging', keywords: ['hug', 'thanks'] },
    { emoji: '🤭', name: 'hand_over_mouth', keywords: ['oops', 'giggle'] },
    { emoji: '🤫', name: 'shushing', keywords: ['quiet', 'secret', 'shh'] },
    { emoji: '🤔', name: 'thinking', keywords: ['hmm', 'think', 'consider'] },
    { emoji: '🤐', name: 'zipper_mouth', keywords: ['secret', 'quiet'] },
    { emoji: '🤨', name: 'raised_eyebrow', keywords: ['suspicious', 'doubt'] },
    { emoji: '😐', name: 'neutral', keywords: ['meh', 'blank'] },
    { emoji: '😑', name: 'expressionless', keywords: ['meh', 'unimpressed'] },
    { emoji: '😶', name: 'no_mouth', keywords: ['silent', 'speechless'] },
    { emoji: '😏', name: 'smirk', keywords: ['smug', 'sly'] },
    { emoji: '😒', name: 'unamused', keywords: ['meh', 'annoyed'] },
    { emoji: '🙄', name: 'eye_roll', keywords: ['whatever', 'annoyed'] },
    { emoji: '😬', name: 'grimacing', keywords: ['awkward', 'yikes'] },
    { emoji: '😌', name: 'relieved', keywords: ['calm', 'peace'] },
    { emoji: '😔', name: 'pensive', keywords: ['sad', 'thoughtful'] },
    { emoji: '😪', name: 'sleepy', keywords: ['tired', 'sleep'] },
    { emoji: '😴', name: 'sleeping', keywords: ['zzz', 'tired', 'sleep'] },
    { emoji: '😷', name: 'mask', keywords: ['sick', 'ill', 'covid'] },
    { emoji: '🤒', name: 'thermometer_face', keywords: ['sick', 'fever'] },
    { emoji: '🤢', name: 'nauseated', keywords: ['sick', 'gross'] },
    { emoji: '🤧', name: 'sneezing', keywords: ['sick', 'cold', 'achoo'] },
    { emoji: '🥵', name: 'hot', keywords: ['heat', 'sweat'] },
    { emoji: '🥶', name: 'cold', keywords: ['freezing', 'ice'] },
    { emoji: '🤯', name: 'exploding_head', keywords: ['mind_blown', 'shocked', 'wow'] },
    { emoji: '🥳', name: 'partying', keywords: ['party', 'celebrate', 'birthday'] },
    { emoji: '😎', name: 'sunglasses', keywords: ['cool', 'chill'] },
    { emoji: '🤓', name: 'nerd', keywords: ['geek', 'smart'] },
    { emoji: '🧐', name: 'monocle', keywords: ['inspect', 'curious'] },
    { emoji: '😕', name: 'confused', keywords: ['unsure', 'puzzled'] },
    { emoji: '😟', name: 'worried', keywords: ['concern', 'nervous'] },
    { emoji: '😮', name: 'open_mouth', keywords: ['surprise', 'wow'] },
    { emoji: '😲', name: 'astonished', keywords: ['shock', 'surprise'] },
    { emoji: '😳', name: 'flushed', keywords: ['embarrassed', 'blush'] },
    { emoji: '🥺', name: 'pleading', keywords: ['please', 'puppy_eyes'] },
    { emoji: '😢', name: 'cry', keywords: ['sad', 'tear'] },
    { emoji: '😭', name: 'sob', keywords: ['cry', 'sad', 'tears'] },
    { emoji: '😱', name: 'scream', keywords: ['fear', 'shock', 'horror'] },
    { emoji: '😤', name: 'triumph', keywords: ['huff', 'proud', 'angry'] },
    { emoji: '😠', name: 'angry', keywords: ['mad', 'annoyed'] },
    { emoji: '😡', name: 'rage', keywords: ['angry', 'mad', 'furious'] },
    { emoji: '🤬', name: 'cursing', keywords: ['swear', 'angry'] },
    { emoji: '😈', name: 'smiling_imp', keywords: ['devil', 'evil'] },
    { emoji: '💀', name: 'skull', keywords: ['dead', 'lol'] },
    { emoji: '💩', name: 'poop', keywords: ['poo', 'crap'] },
    { emoji: '🤡', name: 'clown', keywords: ['funny', 'joke'] },
    { emoji: '👻', name: 'ghost', keywords: ['halloween', 'boo'] },
    { emoji: '👽', name: 'alien', keywords: ['ufo', 'space'] },
    { emoji: '🤖', name: 'robot', keywords: ['bot', 'ai', 'machine'] },
    { emoji: '👋', name: 'wave', keywords: ['hello', 'hi', 'bye'] },
    { emoji: '👌', name: 'ok_hand', keywords: ['ok', 'perfect'] },
    { emoji: '✌️', name: 'victory', keywords: ['peace', 'two'] },
    { emoji: '🤞', name: 'crossed_fingers', keywords: ['luck', 'hope'] },
    { emoji: '🤘', name: 'metal', keywords: ['rock', 'horns'] },
    { emoji: '🤙', name: 'call_me', keywords: ['shaka', 'hang_loose'] },
    { emoji: '👈', name: 'point_left', keywords: ['left', 'direction'] },
    { emoji: '👉', name: 'point_right', keywords: ['right', 'direction'] },
    { emoji: '👆', name: 'point_up', keywords: ['up', 'direction'] },
    { emoji: '👇', name: 'point_down', keywords: ['down', 'direction'] },
    { emoji: '👍', name: 'thumbsup', keywords: ['+1', 'yes', 'like', 'approve'] },
    { emoji: '👎', name: 'thumbsdown', keywords: ['-1', 'no', 'dislike'] },
    { emoji: '✊', name: 'fist', keywords: ['power', 'solidarity'] },
    { emoji: '👊', name: 'punch', keywords: ['fist_bump', 'hit'] },
    { emoji: '👏', name: 'clap', keywords: ['applause', 'bravo', 'congrats'] },
    { emoji: '🙌', name: 'raised_hands', keywords: ['hooray', 'celebrate', 'yay'] },
    { emoji: '👐', name: 'open_hands', keywords: ['hug', 'jazz_hands'] },
    { emoji: '🤝', name: 'handshake', keywords: ['deal', 'agreement', 'partner'] },
    { emoji: '🙏', name: 'pray', keywords: ['please', 'thanks', 'hope'] },
    { emoji: '✍️', name: 'writing_hand', keywords: ['write', 'note'] },
    { emoji: '💪', name: 'muscle', keywords: ['strong', 'flex', 'power'] },
    { emoji: '🧠', name: 'brain', keywords: ['smart', 'think', 'mind'] },
    { emoji: '👀', name: 'eyes', keywords: ['look', 'see', 'watch'] },
    { emoji: '🙋', name: 'raising_hand', keywords: ['question', 'me', 'volunteer'] },
    { emoji: '🤷', name: 'shrug', keywords: ['whatever', 'dunno', 'idk'] },
    { emoji: '🤦', name: 'facepalm', keywords: ['ugh', 'disbelief'] },
    { emoji: '🙇', name: 'bow', keywords: ['sorry', 'respect'] },
    { emoji: '🧑‍💻', name: 'technologist', keywords: ['developer', 'coder', 'computer'] },
    { emoji: '❤️', name: 'heart', keywords: ['love', 'like', 'red'] },
    { emoji: '🧡', name: 'orange_heart', keywords: ['love'] },
    { emoji: '💛', name: 'yellow_heart', keywords: ['love'] },
    { emoji: '💚', name: 'green_heart', keywords: ['love'] },
    { emoji: '💙', name: 'blue_heart', keywords: ['love'] },
    { emoji: '💜', name: 'purple_heart', keywords: ['love'] },
    { emoji: '🖤', name: 'black_heart', keywords: ['love', 'dark'] },
    { emoji: '💔', name: 'broken_heart', keywords: ['sad', 'heartbreak'] },
    { emoji: '💕', name: 'two_hearts', keywords: ['love', 'affection'] },
    { emoji: '💯', name: '100', keywords: ['perfect', 'score', 'hundred'] },
    { emoji: '💥', name: 'boom', keywords: ['explosion', 'collision'] },
    { emoji: '💫', name: 'dizzy', keywords: ['star', 'sparkle'] },
    { emoji: '💬', name: 'speech_balloon', keywords: ['comment', 'chat', 'message'] },
    { emoji: '💡', name: 'bulb', keywords: ['idea', 'light', 'tip'] },
    { emoji: '✨', name: 'sparkles', keywords: ['shiny', 'new', 'magic'] },
    { emoji: '⭐', name: 'star', keywords: ['favorite', 'rating'] },
    { emoji: '🌟', name: 'glowing_star', keywords: ['shine', 'favorite'] },
    { emoji: '🔥', name: 'fire', keywords: ['hot', 'lit', 'flame'] },
    { emoji: '⚡', name: 'zap', keywords: ['lightning', 'fast', 'power'] },
    { emoji: '🎉', name: 'tada', keywords: ['party', 'celebrate', 'congrats'] },
    { emoji: '🎊', name: 'confetti_ball', keywords: ['party', 'celebrate'] },
    { emoji: '🎁', name: 'gift', keywords: ['present', 'birthday'] },
    { emoji: '🏆', name: 'trophy', keywords: ['win', 'award', 'champion'] },
    { emoji: '🥇', name: 'first_place', keywords: ['gold', 'medal', 'win'] },
    { emoji: '🎯', name: 'dart', keywords: ['target', 'goal', 'bullseye'] },
    { emoji: '🚀', name: 'rocket', keywords: ['launch', 'ship', 'fast'] },
    { emoji: '✅', name: 'white_check_mark', keywords: ['done', 'yes', 'check'] },
    { emoji: '☑️', name: 'ballot_box_with_check', keywords: ['done', 'check'] },
    { emoji: '✔️', name: 'heavy_check_mark', keywords: ['done', 'ok'] },
    { emoji: '❌', name: 'x', keywords: ['no', 'wrong', 'cancel'] },
    { emoji: '❗', name: 'exclamation', keywords: ['important', 'warning'] },
    { emoji: '❓', name: 'question', keywords: ['help', 'what'] },
    { emoji: '⚠️', name: 'warning', keywords: ['caution', 'alert'] },
    { emoji: '🚫', name: 'no_entry', keywords: ['forbidden', 'stop'] },
    { emoji: '🔴', name: 'red_circle', keywords: ['stop', 'record'] },
    { emoji: '🟢', name: 'green_circle', keywords: ['go', 'online'] },
    { emoji: '➕', name: 'plus', keywords: ['add', 'new'] },
    { emoji: '➖', name: 'minus', keywords: ['remove', 'subtract'] },
    { emoji: '➡️', name: 'arrow_right', keywords: ['next', 'forward'] },
    { emoji: '⬅️', name: 'arrow_left', keywords: ['back', 'previous'] },
    { emoji: '🔁', name: 'repeat', keywords: ['loop', 'again'] },
    { emoji: '📌', name: 'pushpin', keywords: ['pin', 'location'] },
    { emoji: '📎', name: 'paperclip', keywords: ['attachment', 'clip'] },
    { emoji: '📝', name: 'memo', keywords: ['note', 'write', 'document'] },
    { emoji: '📄', name: 'page', keywords: ['document', 'file'] },
    { emoji: '📁', name: 'folder', keywords: ['directory', 'files'] },
    { emoji: '📅', name: 'calendar', keywords: ['date', 'schedule'] },
    { emoji: '📈', name: 'chart_up', keywords: ['growth', 'increase', 'trend'] },
    { emoji: '📉', name: 'chart_down', keywords: ['decrease', 'decline'] },
    { emoji: '📊', name: 'bar_chart', keywords: ['stats', 'graph', 'data'] },
    { emoji: '📣', name: 'mega', keywords: ['announce', 'megaphone'] },
    { emoji: '📢', name: 'loudspeaker', keywords: ['announce', 'broadcast'] },
    { emoji: '🔔', name: 'bell', keywords: ['notification', 'alert'] },
    { emoji: '🔒', name: 'lock', keywords: ['secure', 'private'] },
    { emoji: '🔑', name: 'key', keywords: ['password', 'access'] },
    { emoji: '🔍', name: 'mag', keywords: ['search', 'find', 'zoom'] },
    { emoji: '🔗', name: 'link', keywords: ['url', 'chain'] },
    { emoji: '🛠️', name: 'tools', keywords: ['fix', 'build', 'settings'] },
    { emoji: '⚙️', name: 'gear', keywords: ['settings', 'config'] },
    { emoji: '🐛', name: 'bug', keywords: ['insect', 'issue', 'error'] },
    { emoji: '💻', name: 'computer', keywords: ['laptop', 'code', 'work'] },
    { emoji: '📱', name: 'phone', keywords: ['mobile', 'iphone', 'android'] },
    { emoji: '⏰', name: 'alarm_clock', keywords: ['time', 'wake', 'deadline'] },
    { emoji: '⏳', name: 'hourglass', keywords: ['wait', 'time', 'loading'] },
    { emoji: '💰', name: 'moneybag', keywords: ['money', 'rich', 'cash'] },
    { emoji: '💸', name: 'money_wings', keywords: ['spend', 'cost'] },
    { emoji: '📦', name: 'package', keywords: ['box', 'shipping', 'delivery'] },
    { emoji: '✏️', name: 'pencil', keywords: ['edit', 'write'] },
    { emoji: '📚', name: 'books', keywords: ['library', 'read', 'study'] },
    { emoji: '☀️', name: 'sunny', keywords: ['sun', 'weather', 'bright'] },
    { emoji: '🌙', name: 'moon', keywords: ['night', 'sleep'] },
    { emoji: '🌈', name: 'rainbow', keywords: ['pride', 'colorful'] },
    { emoji: '☁️', name: 'cloud', keywords: ['weather', 'sky'] },
    { emoji: '🌧️', name: 'rain', keywords: ['weather', 'wet'] },
    { emoji: '❄️', name: 'snowflake', keywords: ['winter', 'cold', 'snow'] },
    { emoji: '🌱', name: 'seedling', keywords: ['plant', 'grow', 'new'] },
    { emoji: '🌸', name: 'cherry_blossom', keywords: ['flower', 'spring'] },
    { emoji: '🌍', name: 'earth', keywords: ['world', 'globe', 'planet'] },
    { emoji: '🐶', name: 'dog', keywords: ['puppy', 'pet'] },
    { emoji: '🐱', name: 'cat', keywords: ['kitten', 'pet'] },
    { emoji: '🦄', name: 'unicorn', keywords: ['magic', 'fantasy'] },
    { emoji: '🍕', name: 'pizza', keywords: ['food', 'slice'] },
    { emoji: '🍔', name: 'hamburger', keywords: ['burger', 'food'] },
    { emoji: '🍰', name: 'cake', keywords: ['dessert', 'birthday'] },
    { emoji: '🍎', name: 'apple', keywords: ['fruit', 'food'] },
    { emoji: '☕', name: 'coffee', keywords: ['cafe', 'drink', 'morning'] },
    { emoji: '🍺', name: 'beer', keywords: ['drink', 'cheers'] },
    { emoji: '🍻', name: 'beers', keywords: ['cheers', 'drink', 'toast'] },
    { emoji: '⚽', name: 'soccer', keywords: ['football', 'ball', 'sport'] },
    { emoji: '🎮', name: 'video_game', keywords: ['game', 'controller', 'play'] },
    { emoji: '🎵', name: 'musical_note', keywords: ['music', 'song'] },
    { emoji: '🎨', name: 'art', keywords: ['paint', 'design', 'palette'] },
    { emoji: '✈️', name: 'airplane', keywords: ['travel', 'flight', 'trip'] },
    { emoji: '🏠', name: 'house', keywords: ['home', 'building'] },
];

type ShortcutId =
    | 'bold'
    | 'italic'
    | 'underline'
    | 'strikethrough'
    | 'subscript'
    | 'superscript'
    | 'link'
    | 'clear_formatting'
    | 'font_size_decrease'
    | 'font_size_increase'
    | 'paragraph'
    | 'heading_1'
    | 'heading_2'
    | 'heading_3'
    | 'heading_4'
    | 'heading_5'
    | 'heading_6'
    | 'numbered_list'
    | 'bulleted_list'
    | 'check_list'
    | 'code_block'
    | 'quote'
    | 'align_left'
    | 'align_center'
    | 'align_right'
    | 'align_justify'
    | 'indent'
    | 'outdent'
    | 'undo'
    | 'redo'
    | 'slash_menu'
    | 'focus_toolbar'
    | 'exit_expanded';

type EditorShortcut = KeyboardShortcutMatch & { id: ShortcutId; label: string; group: string };

const MOD = CONTROL_OR_META;
const MOD_ALT = { ...CONTROL_OR_META, altKey: true };
const MOD_SHIFT = { ...CONTROL_OR_META, shiftKey: true };

const SHORTCUTS: EditorShortcut[] = [
    { id: 'bold', label: 'Tebal', group: 'Format teks', key: 'b', modifiers: MOD },
    { id: 'italic', label: 'Miring', group: 'Format teks', key: 'i', modifiers: MOD },
    { id: 'underline', label: 'Garis bawah', group: 'Format teks', key: 'u', modifiers: MOD },
    { id: 'strikethrough', label: 'Coret', group: 'Format teks', key: 'x', modifiers: MOD_SHIFT },
    { id: 'subscript', label: 'Subskrip', group: 'Format teks', key: ',', modifiers: MOD },
    { id: 'superscript', label: 'Superskrip', group: 'Format teks', key: '.', modifiers: MOD },
    { id: 'link', label: 'Sisipkan atau ubah link', group: 'Format teks', key: 'k', modifiers: MOD },
    { id: 'clear_formatting', label: 'Hapus format', group: 'Format teks', key: '\\', modifiers: MOD },
    {
        id: 'font_size_decrease',
        label: 'Perkecil ukuran font',
        group: 'Format teks',
        key: '<',
        unshiftedKey: ',',
        modifiers: MOD_SHIFT,
    },
    {
        id: 'font_size_increase',
        label: 'Perbesar ukuran font',
        group: 'Format teks',
        key: '>',
        unshiftedKey: '.',
        modifiers: MOD_SHIFT,
    },
    { id: 'paragraph', label: 'Teks normal', group: 'Blok', key: '0', modifiers: MOD_ALT },
    { id: 'heading_1', label: 'Heading 1', group: 'Blok', key: '1', modifiers: MOD_ALT },
    { id: 'heading_2', label: 'Heading 2', group: 'Blok', key: '2', modifiers: MOD_ALT },
    { id: 'heading_3', label: 'Heading 3', group: 'Blok', key: '3', modifiers: MOD_ALT },
    { id: 'heading_4', label: 'Heading 4', group: 'Blok', key: '4', modifiers: MOD_ALT },
    { id: 'heading_5', label: 'Heading 5', group: 'Blok', key: '5', modifiers: MOD_ALT },
    { id: 'heading_6', label: 'Heading 6', group: 'Blok', key: '6', modifiers: MOD_ALT },
    { id: 'numbered_list', label: 'Daftar bernomor', group: 'Blok', key: '7', modifiers: MOD_ALT },
    { id: 'bulleted_list', label: 'Daftar berpoin', group: 'Blok', key: '8', modifiers: MOD_ALT },
    { id: 'check_list', label: 'Daftar centang', group: 'Blok', key: '9', modifiers: MOD_ALT },
    { id: 'code_block', label: 'Code block', group: 'Blok', key: 'c', modifiers: MOD_ALT },
    { id: 'quote', label: 'Kutipan', group: 'Blok', key: 'q', modifiers: MOD_ALT },
    { id: 'align_left', label: 'Rata kiri', group: 'Perataan & indentasi', key: 'l', modifiers: MOD_SHIFT },
    { id: 'align_center', label: 'Rata tengah', group: 'Perataan & indentasi', key: 'e', modifiers: MOD_SHIFT },
    { id: 'align_right', label: 'Rata kanan', group: 'Perataan & indentasi', key: 'r', modifiers: MOD_SHIFT },
    { id: 'align_justify', label: 'Rata kiri-kanan', group: 'Perataan & indentasi', key: 'j', modifiers: MOD_SHIFT },
    { id: 'indent', label: 'Tambah indentasi', group: 'Perataan & indentasi', key: 'Tab' },
    {
        id: 'outdent',
        label: 'Kurangi indentasi',
        group: 'Perataan & indentasi',
        key: 'Tab',
        modifiers: { shiftKey: true },
    },
    { id: 'undo', label: 'Urungkan', group: 'Editor', key: 'z', modifiers: MOD },
    IS_APPLE
        ? { id: 'redo', label: 'Ulangi', group: 'Editor', key: 'z', modifiers: MOD_SHIFT }
        : { id: 'redo', label: 'Ulangi', group: 'Editor', key: 'y', modifiers: { ctrlKey: true } },
    { id: 'slash_menu', label: 'Buka menu perintah', group: 'Editor', key: '/' },
    {
        id: 'focus_toolbar',
        label: 'Pindahkan fokus ke toolbar',
        group: 'Editor',
        key: 'F10',
        modifiers: { altKey: true },
    },
    { id: 'exit_expanded', label: 'Keluar dari tampilan penuh', group: 'Editor', key: 'Escape' },
];

export type { DocumentFormat, EditorShortcut, Emoji, ShortcutId };
export {
    AUTO_LINK_MATCHERS,
    BLOCK_TYPES,
    CODE_TAB_SIZE,
    COLOR_SWATCHES,
    COLUMN_LAYOUTS,
    DOCUMENT_EXPORT_FILE_NAME,
    DOCUMENT_IMPORT_ACCEPT,
    DOCUMENT_IMPORT_FORMATS,
    EMOJIS,
    FONT_FAMILIES,
    FONT_SIZE_DEFAULT,
    FONT_SIZE_MAX,
    FONT_SIZE_MIN,
    IMAGE_ACCEPT,
    IMAGE_MAX_SIZE,
    IMAGE_MAX_WIDTH,
    IMAGE_MIN_WIDTH,
    LINK_PROTOCOLS,
    MAX_LIST_INDENT,
    MENTION_MAX_QUERY_LENGTH,
    MENTION_MENU_LIMIT,
    MENTION_SEARCH_DELAY,
    SHORTCUTS,
    TABLE_DEFAULT_COLUMNS,
    TABLE_DEFAULT_ROWS,
    TABLE_MAX_COLUMNS,
    TABLE_MAX_ROWS,
    TABLE_MIN_COLUMN_WIDTH,
    TABLE_MIN_ROW_HEIGHT,
};
