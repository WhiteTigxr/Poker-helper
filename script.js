document.addEventListener('DOMContentLoaded', function() {
    
    // --- Global Tab Navigation Logic ---
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            const tabId = link.getAttribute('data-tab');

            tabLinks.forEach(item => item.classList.remove('active'));
            tabContents.forEach(item => item.classList.remove('active'));

            link.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // --- Tab 1: Range Chart Logic ---
    const chartFormatSelect = document.getElementById('chart-format');
    const stageSelect = document.getElementById('chart-stage');
    const posSelect9max = document.getElementById('position-select-9max');
    const posSelect6max = document.getElementById('position-select-6max');
    const chartTitle = document.getElementById('chart-title');
    const rangeGrid = document.getElementById('range-grid');
    const chartLegend = document.getElementById('chart-legend');
    
    const handRanks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

    /**
     * Data Structure 2D (13x13)
     * S = Shove / Strong Raise / 3-Bet / Call Shove (สีแดง)
     * R = Raise / Call (สีเขียว)
     * L = Limp / Marginal Call (สีเหลือง)
     * F = Fold (สีเทา)
     */
    
    // --- Data 9-Max (RFI) ---
    const baseRangeData9max = {
        'deep-utg': [
            ['S', 'R', 'R', 'R', 'R', 'L', 'F', 'F', 'F', 'L', 'F', 'F', 'F'], // A
            ['R', 'S', 'R', 'R', 'L', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F'], // K
            ['R', 'R', 'S', 'R', 'L', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F'], // Q
            ['R', 'L', 'L', 'S', 'R', 'L', 'F', 'F', 'F', 'F', 'F', 'F', 'F'], // J
            ['L', 'L', 'F', 'R', 'S', 'R', 'F', 'F', 'F', 'F', 'F', 'F', 'F'], // T
            ['F', 'F', 'F', 'L', 'R', 'S', 'R', 'F', 'F', 'F', 'F', 'F', 'F'], // 9
            ['F', 'F', 'F', 'F', 'F', 'R', 'S', 'R', 'F', 'F', 'F', 'F', 'F'], // 8
            ['F', 'F', 'F', 'F', 'F', 'F', 'R', 'S', 'R', 'F', 'F', 'F', 'F'], // 7
            ['F', 'F', 'F', 'F', 'F', 'F', 'F', 'L', 'S', 'L', 'F', 'F', 'F'], // 6
            ['L', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'L', 'S', 'L', 'F', 'F'], // 5
            ['F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'S', 'F', 'F'], // 4
            ['F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'S', 'F'], // 3
            ['F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'S']  // 2
        ],
        'deep-mp_group': [ // For UTG+1, MP, LJ
            ['S', 'R', 'R', 'R', 'R', 'R', 'L', 'L', 'L', 'R', 'F', 'F', 'F'],
            ['R', 'S', 'R', 'R', 'R', 'L', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
            ['R', 'R', 'S', 'R', 'R', 'L', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
            ['R', 'R', 'R', 'S', 'R', 'R', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
            ['R', 'L', 'L', 'R', 'S', 'R', 'L', 'F', 'F', 'F', 'F', 'F', 'F'],
            ['L', 'F', 'F', 'L', 'R', 'S', 'R', 'R', 'F', 'F', 'F', 'F', 'F'],
            ['F', 'F', 'F', 'F', 'L', 'R', 'S', 'R', 'L', 'F', 'F', 'F', 'F'],
            ['F', 'F', 'F', 'F', 'F', 'L', 'R', 'S', 'R', 'F', 'F', 'F', 'F'],
            ['L', 'F', 'F', 'F', 'F', 'F', 'F', 'R', 'S', 'R', 'F', 'F', 'F'],
            ['L', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'R', 'S', 'R', 'F', 'F'],
            ['L', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'L', 'S', 'F', 'F'],
            ['F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'S', 'F'],
            ['F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'S']
        ],
        'deep-hj': [
            ['S','R','R','R','R','R','R','R','R','R','L','L','L'],
            ['R','S','R','R','R','R','L','L','F','F','F','F','F'],
            ['R','R','S','R','R','R','L','L','F','F','F','F','F'],
            ['R','R','R','S','R','R','R','L','F','F','F','F','F'],
            ['R','R','R','R','S','R','R','R','L','F','F','F','F'],
            ['R','L','L','R','R','S','R','R','R','L','F','F','F'],
            ['R','L','F','L','R','R','S','R','R','L','F','F','F'],
            ['L','F','F','F','L','R','R','S','R','R','F','F','F'],
            ['L','F','F','F','F','L','R','R','S','R','L','F','F'],
            ['L','F','F','F','F','F','L','R','R','S','R','L','F'],
            ['L','F','F','F','F','F','F','L','L','R','S','L','F'],
            ['L','F','F','F','F','F','F','F','F','L','L','S','L'],
            ['L','F','F','F','F','F','F','F','F','F','F','L','S']
        ],
        'deep-co': [
            ['S','R','R','R','R','R','R','R','R','R','R','R','R'],
            ['R','S','R','R','R','R','R','R','L','L','L','F','F'],
            ['R','R','S','R','R','R','R','R','L','L','F','F','F'],
            ['R','R','R','S','R','R','R','R','R','L','L','F','F'],
            ['R','R','R','R','S','R','R','R','R','R','L','F','F'],
            ['R','R','L','R','R','S','R','R','R','R','L','F','F'],
            ['R','L','L','R','R','R','S','R','R','R','L','F','F'],
            ['R','L','L','L','R','R','R','S','R','R','L','F','F'],
            ['R','L','L','L','L','R','R','R','S','R','R','L','F'],
            ['R','L','L','L','L','L','R','R','R','S','R','R','F'],
            ['R','L','L','F','F','L','L','R','R','R','S','R','L'],
            ['R','F','F','F','F','F','F','L','L','R','R','S','L'],
            ['R','F','F','F','F','F','F','F','L','L','L','R','S']
        ],
        'deep-btn': [
            ['S','R','R','R','R','R','R','R','R','R','R','R','R'],
            ['R','S','R','R','R','R','R','R','R','R','R','L','L'],
            ['R','R','S','R','R','R','R','R','R','R','L','L','L'],
            ['R','R','R','S','R','R','R','R','R','R','L','L','F'],
            ['R','R','R','R','S','R','R','R','R','R','L','L','F'],
            ['R','R','R','R','R','S','R','R','R','R','R','L','F'],
            ['R','R','R','R','R','R','S','R','R','R','R','L','F'],
            ['R','R','L','R','R','R','R','S','R','R','R','L','F'],
            ['R','R','L','L','R','R','R','R','S','R','R','L','F'],
            ['R','R','L','L','L','L','R','R','R','S','R','R','L'],
            ['R','R','L','L','L','L','L','R','R','R','S','R','L'],
            ['R','L','L','L','L','L','L','L','L','R','R','S','R'],
            ['R','L','L','L','L','L','L','L','L','L','R','R','S']
        ],
        'deep-sb': [ 
            ['S','R','R','R','R','R','R','R','R','R','R','R','R'],
            ['R','S','R','R','R','R','R','R','R','R','R','R','R'],
            ['R','R','S','R','R','R','R','R','R','R','R','R','L'],
            ['R','R','R','S','R','R','R','R','R','R','R','R','L'],
            ['R','R','R','R','S','R','R','R','R','R','R','L','L'],
            ['R','R','R','R','R','S','R','R','R','R','R','L','L'],
            ['R','R','L','R','R','R','S','R','R','R','L','L','L'],
            ['R','R','L','R','R','R','R','S','R','R','L','L','L'],
            ['R','R','L','L','L','R','R','R','S','R','R','L','L'],
            ['R','L','L','L','L','L','R','R','R','S','R','L','L'],
            ['R','L','L','L','L','L','L','L','R','R','S','R','L'],
            ['R','L','L','L','L','L','L','L','L','L','R','S','L'],
            ['R','L','L','L','L','L','L','L','L','L','L','L','S']
        ],
        'deep-bb': [
            ['S','S','S','S','S','R','R','L','L','L','L','F','F'], // A
            ['S','S','S','S','R','R','R','L','L','F','F','F','F'], // K
            ['S','S','S','S','R','R','R','L','L','F','F','F','F'], // Q
            ['S','S','S','S','R','R','R','L','F','F','F','F','F'], // J
            ['S','R','R','R','S','R','R','L','F','F','F','F','F'], // T
            ['R','R','R','R','R','S','R','R','L','F','F','F','F'], // 9
            ['R','R','R','L','R','R','S','R','L','F','F','F','F'], // 8
            ['L','L','L','L','L','R','R','S','R','L','F','F','F'], // 7
            ['L','L','L','F','L','L','R','R','S','R','L','F','F'], // 6
            ['L','L','F','F','F','L','L','R','R','S','R','F','F'], // 5
            ['L','F','F','F','F','F','F','L','L','L','S','L','F'], // 4
            ['L','F','F','F','F','F','F','F','F','F','L','S','L'], // 3
            ['L','F','F','F','F','F','F','F','F','F','F','L','S']  // 2
        ]
    };
    // --- Data 9-Max (Push/Fold <15bb RFI) ---
    const pushFoldRangeData9max = {
        'pushfold-utg': [
            ['S','S','S','L','L','F','F','F','F','F','F','F','F'], // A
            ['S','S','L','L','F','F','F','F','F','F','F','F','F'], // K
            ['S','L','S','L','F','F','F','F','F','F','F','F','F'], // Q
            ['L','L','L','S','L','F','F','F','F','F','F','F','F'], // J
            ['L','F','F','L','S','L','F','F','F','F','F','F','F'], // T
            ['F','F','F','F','F','S','F','F','F','F','F','F','F'], // 9
            ['F','F','F','F','F','F','S','F','F','F','F','F','F'], // 8
            ['F','F','F','F','F','F','F','S','F','F','F','F','F'], // 7
            ['F','F','F','F','F','F','F','F','S','F','F','F','F'], // 6
            ['F','F','F','F','F','F','F','F','F','S','F','F','F'], // 5
            ['F','F','F','F','F','F','F','F','F','F','S','F','F'], // 4
            ['F','F','F','F','F','F','F','F','F','F','F','S','F'], // 3
            ['F','F','F','F','F','F','F','F','F','F','F','F','S']  // 2
        ],
        'pushfold-mp_group': [ // For UTG+1, MP, LJ
            ['S','S','S','S','R','L','L','F','F','F','F','F','F'],
            ['S','S','S','R','L','L','F','F','F','F','F','F','F'],
            ['S','S','S','R','L','F','F','F','F','F','F','F','F'],
            ['S','R','R','S','R','L','F','F','F','F','F','F','F'],
            ['R','L','L','R','S','R','F','F','F','F','F','F','F'],
            ['L','F','F','L','R','S','L','F','F','F','F','F','F'],
            ['L','F','F','F','L','R','S','L','F','F','F','F','F'],
            ['F','F','F','F','F','F','R','S','L','F','F','F','F'],
            ['F','F','F','F','F','F','F','F','S','L','F','F','F'],
            ['F','F','F','F','F','F','F','F','F','S','F','F','F'],
            ['F','F','F','F','F','F','F','F','F','F','S','F','F'],
            ['F','F','F','F','F','F','F','F','F','F','F','S','F'],
            ['F','F','F','F','F','F','F','F','F','F','F','F','S']
        ],
        'pushfold-hj': [
            ['S','S','S','S','S','R','R','L','L','L','F','F','F'],
            ['S','S','S','S','R','R','L','F','F','F','F','F','F'],
            ['S','S','S','S','R','R','L','F','F','F','F','F','F'],
            ['S','S','R','S','R','R','L','F','F','F','F','F','F'],
            ['S','R','R','R','S','R','L','F','F','F','F','F','F'],
            ['R','L','L','L','R','S','R','L','F','F','F','F','F'],
            ['L','L','F','F','L','R','S','R','L','F','F','F','F'],
            ['L','F','F','F','F','L','R','S','R','F','F','F','F'],
            ['L','F','F','F','F','F','L','R','S','L','F','F','F'],
            ['F','F','F','F','F','F','F','L','L','S','L','F','F'],
            ['F','F','F','F','F','F','F','F','F','F','S','F','F'],
            ['F','F','F','F','F','F','F','F','F','F','F','S','F'],
            ['F','F','F','F','F','F','F','F','F','F','F','F','S']
        ],
        'pushfold-co': [
            ['S','S','S','S','S','S','R','R','R','R','R','L','L'],
            ['S','S','S','S','S','R','R','R','L','L','F','F','F'],
            ['S','S','S','S','S','R','R','L','L','F','F','F','F'],
            ['S','S','S','S','S','R','R','L','F','F','F','F','F'],
            ['S','S','R','R','S','S','R','R','L','F','F','F','F'],
            ['R','R','R','L','R','S','R','R','L','F','F','F','F'],
            ['R','R','L','L','L','R','S','R','R','L','F','F','F'],
            ['R','L','L','L','L','L','R','S','R','L','F','F','F'],
            ['R','L','L','L','F','L','L','R','S','R','L','F','F'],
            ['R','L','F','F','F','F','L','L','R','S','R','F','F'],
            ['L','F','F','F','F','F','F','F','L','R','S','L','F'],
            ['L','F','F','F','F','F','F','F','F','F','L','S','L'],
            ['L','F','F','F','F','F','F','F','F','F','F','L','S']
        ],
        'pushfold-btn': [
            ['S','S','S','S','S','S','S','S','S','S','S','S','S'],
            ['S','S','S','S','S','S','S','S','R','R','R','R','R'],
            ['S','S','S','S','S','S','S','R','R','R','L','L','L'],
            ['S','S','S','S','S','S','R','R','R','L','L','F','F'],
            ['S','S','S','S','S','S','R','R','R','L','L','F','F'],
            ['S','S','R','R','R','S','S','R','R','R','L','F','F'],
            ['S','R','R','R','R','R','S','S','R','R','L','F','F'],
            ['S','R','R','L','L','R','R','S','R','R','L','F','F'],
            ['S','R','L','L','L','R','R','R','S','R','R','L','F'],
            ['S','R','L','L','L','L','R','R','R','S','R','R','F'],
            ['S','R','L','L','L','L','L','R','R','R','S','R','L'],
            ['S','L','L','L','L','L','L','L','L','R','R','S','R'],
            ['S','L','L','L','L','L','L','L','L','L','R','R','S']
        ],
        'pushfold-sb': [ 
            ['S','S','S','S','S','S','S','S','S','S','S','S','S'],
            ['S','S','S','S','S','S','S','S','S','S','S','S','S'],
            ['S','S','S','S','S','S','S','S','S','S','S','S','R'],
            ['S','S','S','S','S','S','S','S','S','S','S','R','R'],
            ['S','S','S','S','S','S','S','S','S','S','R','R','R'],
            ['S','S','S','S','S','S','S','S','S','R','R','R','L'],
            ['S','S','S','S','S','S','S','S','S','R','R','L','L'],
            ['S','S','S','S','S','S','S','S','R','R','L','L','L'],
            ['S','S','S','S','S','R','R','R','S','R','R','L','L'],
            ['S','S','S','S','R','R','R','R','R','S','R','L','L'],
            ['S','S','R','R','R','R','L','L','R','R','S','R','L'],
            ['S','S','R','R','L','L','L','L','L','L','R','S','L'],
            ['S','R','R','L','L','L','L','L','L','L','L','L','S']
        ],
        'pushfold-bb': [
            ['S','S','S','S','S','L','L','F','F','F','F','F','F'], // A
            ['S','S','S','S','L','L','F','F','F','F','F','F','F'], // K
            ['S','S','S','L','L','F','F','F','F','F','F','F','F'], // Q
            ['S','L','L','S','L','F','F','F','F','F','F','F','F'], // J
            ['S','L','F','L','S','F','F','F','F','F','F','F','F'], // T
            ['L','F','F','F','F','S','F','F','F','F','F','F','F'], // 9
            ['L','F','F','F','F','F','S','F','F','F','F','F','F'], // 8
            ['F','F','F','F','F','F','F','S','F','F','F','F','F'], // 7
            ['F','F','F','F','F','F','F','F','S','F','F','F','F'], // 6
            ['F','F','F','F','F','F','F','F','F','S','F','F','F'], // 5
            ['F','F','F','F','F','F','F','F','F','F','S','F','F'], // 4
            ['F','F','F','F','F','F','F','F','F','F','F','S','F'], // 3
            ['F','F','F','F','F','F','F','F','F','F','F','F','S']  // 2
        ]
    };

    // --- Data 6-Max (RFI) ---
    const baseRangeData6max = {
        'deep-utg': baseRangeData9max['deep-mp_group'], // 6-max UTG = 9-max MP
        'deep-mp': baseRangeData9max['deep-hj'], // 6-max MP = 9-max HJ
        'deep-co': baseRangeData9max['deep-co'],
        'deep-btn': baseRangeData9max['deep-btn'],
        'deep-sb': baseRangeData9max['deep-sb'],
        'deep-bb': baseRangeData9max['deep-bb'] // BB vs SB defense is the same
    };
    // --- Data 6-Max (Push/Fold RFI) ---
    const pushFoldRangeData6max = {
        'pushfold-utg': pushFoldRangeData9max['pushfold-mp_group'],
        'pushfold-mp': pushFoldRangeData9max['pushfold-hj'],
        'pushfold-co': pushFoldRangeData9max['pushfold-co'],
        'pushfold-btn': pushFoldRangeData9max['pushfold-btn'],
        'pushfold-sb': pushFoldRangeData9max['pushfold-sb'],
        'pushfold-bb': pushFoldRangeData9max['pushfold-bb'] // BB vs SB Call Shove is the same
    };


    // --- Logic สลับ Dropdown (ใหม่) ---
    function handleFormatChange(formatSelect, pos9max, pos6max) {
        if (formatSelect.value === '9max') {
            pos9max.classList.remove('hidden');
            pos6max.classList.add('hidden');
        } else {
            pos9max.classList.add('hidden');
            pos6max.classList.remove('hidden');
        }
    }

    // Event Listener สำหรับ Tab 1
    chartFormatSelect.addEventListener('change', () => {
        handleFormatChange(chartFormatSelect, posSelect9max, posSelect6max);
        updateRangeChart(); // อัปเดต Chart ทันที
    });

    // Event Listener สำหรับ Tab 2
    const pushFormatSelect = document.getElementById('push-format');
    const pushPos9max = document.getElementById('push-position-9max');
    const pushPos6max = document.getElementById('push-position-6max');
    pushFormatSelect.addEventListener('change', () => {
        handleFormatChange(pushFormatSelect, pushPos9max, pushPos6max);
    });

    // --- Logic อัปเดต Chart (อัปเดตสำหรับ BB) ---
    function getHandName(r, c) {
        if (r === c) return `${handRanks[r]}${handRanks[c]}`; // Pair
        if (r < c) return `${handRanks[r]}${handRanks[c]}s`; // Suited
        return `${handRanks[c]}${handRanks[r]}o`; // Offsuit
    }

    function getHandClass(char) {
        switch(char) {
            case 'S': return 'shove';
            case 'R': return 'raise';
            case 'L': return 'limp';
            default: return 'fold';
        }
    }

    function modifyChartData(baseData, stage) {
        const newData = JSON.parse(JSON.stringify(baseData)); // Deep Copy
        let foldToLimp = 0, limpToRaise = 0;
        
        if (stage === 'middle') { // <60bb
            foldToLimp = 0.15; limpToRaise = 0.1;
        } else if (stage === 'late') { // <40bb
            foldToLimp = 0.3; limpToRaise = 0.25;
        } else if (stage === 'low') { // <25bb
            foldToLimp = 0.5; limpToRaise = 0.4;
        }

        for (let r = 0; r < 13; r++) {
            for (let c = 0; c < 13; c++) {
                const rand = Math.random();
                if (newData[r][c] === 'F' && rand < foldToLimp) {
                    newData[r][c] = 'L';
                } else if (newData[r][c] === 'L' && rand < limpToRaise) {
                    newData[r][c] = 'R';
                }
            }
        }
        return newData;
    }

    function updateRangeChart() {
        const stage = stageSelect.value;
        const format = chartFormatSelect.value;
        
        let pos = (format === '9max') ? posSelect9max.value : posSelect6max.value;
        let posGroup = pos; // 'bb' จะถูกส่งต่อไปตรงๆ

        // Map 9-max Position
        if (format === '9max' && (pos === 'utg1' || pos === 'mp' || pos === 'lj')) {
            posGroup = 'mp_group';
        }

        let data, baseDataRepo, pushDataRepo, legendHTML = '', titleText = '';
        
        // เลือกคลังข้อมูล
        if (format === '9max') {
            baseDataRepo = baseRangeData9max;
            pushDataRepo = pushFoldRangeData9max;
        } else {
            baseDataRepo = baseRangeData6max;
            pushDataRepo = pushFoldRangeData6max;
        }
        
        const stageText = stageSelect.options[stageSelect.selectedIndex].text;
        const posText = (format === '9max') ? posSelect9max.options[posSelect9max.selectedIndex].text : posSelect6max.options[posSelect6max.selectedIndex].text;
        const formatText = chartFormatSelect.options[chartFormatSelect.selectedIndex].text;

        // อัปเดต Legend และ Title
        if (stage === 'pushfold') {
            const key = `pushfold-${posGroup}`;
            data = pushDataRepo[key] || pushDataRepo[Object.keys(pushDataRepo)[0]]; // Fallback
            
            if (pos === 'bb') {
                titleText = `Range: ${stageText} - ${formatText} - BB vs SB Shove`;
                legendHTML = `
                    <span class="legend-shove">Call Shove</span>
                    <span class="legend-limp">Marginal Call</span>
                    <span class="legend-fold">Fold</span>
                `;
            } else {
                titleText = `Range: ${stageText} - ${formatText} - ${posText} (Open Shove)`;
                legendHTML = `
                    <span class="legend-shove">Shove (All-in)</span>
                    <span class="legend-raise">Marginal Shove</span>
                    <span class="legend-limp">Limp/Fold</span>
                    <span class="legend-fold">Fold</span>
                `;
            }
        } else { // Deep, Middle, Late, Low
            const baseKey = `deep-${posGroup}`;
            const baseData = baseDataRepo[baseKey] || baseDataRepo[Object.keys(baseDataRepo)[0]]; // Fallback
            data = (stage === 'deep') ? baseData : modifyChartData(baseData, stage);
            
            if (pos === 'bb') {
                titleText = `Range: ${stageText} - ${formatText} - BB vs SB Open`;
                legendHTML = `
                    <span class="legend-shove">3-Bet</span>
                    <span class="legend-raise">Call</span>
                    <span class="legend-limp">Marginal Call / Mix</span>
                    <span class="legend-fold">Fold</span>
                `;
            } else {
                titleText = `Range: ${stageText} - ${formatText} - ${posText} (RFI)`;
                legendHTML = `
                    <span class="legend-shove">Strong Raise</span>
                    <span class="legend-raise">Raise</span>
                    <span class="legend-limp">Limp / Marginal</span>
                    <span class="legend-fold">Fold</span>
                `;
            }
        }
        
        chartTitle.textContent = titleText;
        chartLegend.innerHTML = legendHTML;

        // Clear existing grid
        rangeGrid.innerHTML = '';
        
        // สร้าง Grid
        for (let r = 0; r < 13; r++) {
            const row = rangeGrid.insertRow();
            for (let c = 0; c < 13; c++) {
                const cell = row.insertCell();
                cell.textContent = getHandName(r, c);
                let handType = (data[r] && data[r][c]) ? data[r][c] : 'F';
                cell.className = getHandClass(handType);
            }
        }
    }

    // Add event listeners to dropdowns
    stageSelect.addEventListener('change', updateRangeChart);
    posSelect9max.addEventListener('change', updateRangeChart);
    posSelect6max.addEventListener('change', updateRangeChart);
    
    // Initial call
    updateRangeChart();


    // --- Tab 2: Push/Fold Helper Logic (อัปเดต) ---
    const pushFoldBtn = document.getElementById('push-fold-btn');
    const pushFoldResult = document.getElementById('push-fold-result');

    pushFoldBtn.addEventListener('click', () => {
        const stack = parseFloat(document.getElementById('push-stack').value);
        const format = pushFormatSelect.value;
        const position = (format === '9max') ? pushPos9max.value : pushPos6max.value;
        const action = document.getElementById('push-action').value;
        
        let rangeText = "";
        let resultClass = "";
        let actionTitle = "";

        if (isNaN(stack) || stack <= 0) {
            actionTitle = "ข้อมูลผิดพลาด";
            rangeText = "กรุณาใส่ Stack Size (BB) ให้ถูกต้อง";
            resultClass = "result-box-fold";
        } else {
            // (Logic ตัวอย่างง่ายๆ)
            if (action === 'open-shove') {
                actionTitle = `Open Shove Range (${format.toUpperCase()} / ${position.toUpperCase()})`;
                resultClass = "result-box-push";
                if (stack <= 10 && position === 'sb') {
                    rangeText = "K2s+, Q2s+, ..., A2o+, K2o+, ... (ประมาณ 80-90%)";
                } else if (stack <= 12 && position === 'btn') {
                    rangeText = "22+, A2s+, K7s+, Q9s+, ATo+, KJo+ (ประมาณ 40-50%)";
                } else if (stack <= 12 && (position === 'utg' || position === 'mp')) {
                    rangeText = `88+, ATs+, KQs, AQo+ (Range แคบมากสำหรับ ${position.toUpperCase()})`;
                } else if (stack > 15) {
                     rangeText = "Stack ( > 15bb) อาจจะลึกเกินไปสำหรับ Open Shove (พิจารณา Min-Raise) ให้ไปดูที่ Range Chart (Low <25bb)";
                     resultClass = "result-box-raise";
                }
                else {
                    rangeText = "22+, A9s+, KTs+, QJs, AJo+, KQo (Range กว้างขึ้นตามตำแหน่ง)";
                }
            } else if (action === '3bet-shove') {
                actionTitle = "3-Bet Shove Range (ตัวอย่าง)";
                resultClass = "result-box-push";
                if (stack <= 25) {
                    rangeText = "TT+, AQs+, AKo (Value) / A5s, KJs (Bluff/Semi-Bluff)";
                } else {
                    rangeText = "Stack ( > 25bb) อาจจะลึกเกินไปสำหรับ 3-Bet Shove (พิจารณา 3-Bet ปกติ)";
                    resultClass = "result-box-raise";
                }
            }
        }

        pushFoldResult.innerHTML = `<h3>${actionTitle}</h3><p class="${resultClass}">${rangeText}</p>`;
        pushFoldResult.style.display = 'block';
    });


    // --- Tab 3: Outs Calculator Logic (อัปเกรดให้แม่นยำ) ---
    const outsCalcBtn = document.getElementById('outs-calc-btn');
    const outsResult = document.getElementById('outs-result');

    outsCalcBtn.addEventListener('click', () => {
        const outs = parseInt(document.getElementById('outs-count').value);
        const street = document.getElementById('outs-street').value;
        
        if (isNaN(outs) || outs <= 0 || outs > 22) { // 22 คือ outs สูงสุด (เช่น Pair+OESD+Flush draw)
            outsResult.innerHTML = `<h3>ข้อมูลผิดพลาด</h3><p class="result-box-fold">กรุณาใส่จำนวน Outs (1-22) ให้ถูกต้อง</p>`;
            outsResult.style.display = 'block';
            return;
        }

        let resultHTML = '';

        if (street === 'flop') {
            const unknownCards = 47; // 52 - 2 (hand) - 3 (flop)
            // โอกาสติดที่ Turn
            const turnHit = (outs / unknownCards) * 100;
            // โอกาสติดที่ Turn หรือ River (คำนวณจากโอกาสไม่ติด)
            const turnOrRiverHit = (1 - ((unknownCards - outs) / unknownCards) * ((unknownCards - 1 - outs) / (unknownCards - 1))) * 100;
            
            resultHTML = `
                <h3>ผลการคำนวณ ( ${outs} Outs )</h3>
                <p class="outs-percent-label">โอกาสติดในใบ Turn (ใบเดียว):</p>
                <p class="outs-percent">${turnHit.toFixed(1)}%</p>
                <p class="outs-percent-label">โอกาสติดภายในใบ River (2 ใบ):</p>
                <p class="outs-percent">${turnOrRiverHit.toFixed(1)}%</p>
                <p style="font-size: 0.9em; color: var(--text-secondary);">(Rule of 4/2: ~${outs*2}% / ~${outs*4}%)</p>
            `;
            
        } else { // street === 'turn'
            const unknownCards = 46; // 52 - 2 (hand) - 4 (board)
            // โอกาสติดที่ River
            const riverHit = (outs / unknownCards) * 100;
            
            resultHTML = `
                <h3>ผลการคำนวณ ( ${outs} Outs )</h3>
                <p class="outs-percent-label">โอกาสติดในใบ River (ใบเดียว):</p>
                <p class="outs-percent">${riverHit.toFixed(1)}%</p>
                <p style="font-size: 0.9em; color: var(--text-secondary);">(Rule of 2: ~${outs*2}%)</p>
            `;
        }

        outsResult.innerHTML = resultHTML;
        outsResult.style.display = 'block';
    });
});