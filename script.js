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
    const stageSelect = document.getElementById('chart-stage');
    const posSelect = document.getElementById('chart-position');
    const chartTitle = document.getElementById('chart-title');
    const rangeGrid = document.getElementById('range-grid');
    const chartLegend = document.getElementById('chart-legend');
    
    const handRanks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

    /**
     * Data Structure 2D (13x13)
     * S = Shove / Strong Raise (สีแดง)
     * R = Raise (สีเขียว)
     * L = Limp / Marginal (สีเหลือง)
     * F = Fold (สีเทา)
     */
    
    // ข้อมูลพื้นฐาน (Deep Stack 80bb+)
    const baseRangeData = {
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
        'deep-sb': [ // SB (vs BB) RFI Range (Raise or Limp)
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
        ]
    };

    // ข้อมูล Push/Fold (<15bb) (Open Shove)
    // S = Shove (All-in), F = Fold
    const pushFoldRangeData = {
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
        'pushfold-sb': [ // SB (vs BB) Shove or Limp
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
        ]
    };

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

    // ฟังก์ชันในการปรับแก้ Chart ตาม Stack
    function modifyChartData(baseData, stage) {
        // สร้าง Deep Copy ของ Array เพื่อไม่ให้กระทบต้นฉบับ
        const newData = JSON.parse(JSON.stringify(baseData));

        // กำหนดระดับการ "ขยาย" Range
        let foldToLimp = 0;
        let limpToRaise = 0;
        
        if (stage === 'middle') { // <60bb
            foldToLimp = 0.15; // เปลี่ยน F -> L 15%
            limpToRaise = 0.1; // เปลี่ยน L -> R 10%
        } else if (stage === 'late') { // <40bb
            foldToLimp = 0.3;  // เปลี่ยน F -> L 30%
            limpToRaise = 0.25; // เปลี่ยน L -> R 25%
        } else if (stage === 'low') { // <25bb
            foldToLimp = 0.5;  // เปลี่ยน F -> L 50%
            limpToRaise = 0.4; // เปลี่ยน L -> R 40%
        }

        for (let r = 0; r < 13; r++) {
            for (let c = 0; c < 13; c++) {
                const rand = Math.random(); // สุ่ม 0.0 - 1.0
                if (newData[r][c] === 'F' && rand < foldToLimp) {
                    newData[r][c] = 'L';
                } else if (newData[r][c] === 'L' && rand < limpToRaise) {
                    newData[r][c] = 'R';
                }
            }
        }
        return newData;
    }

    // ฟังก์ชันหลักในการอัปเดตตาราง
    function updateRangeChart() {
        const stage = stageSelect.value;
        let pos = posSelect.value;

        // Map Position (UTG+1, MP, LJ ให้อยู่กลุ่มเดียวกัน)
        let posGroup = pos;
        if (pos === 'utg1' || pos === 'mp' || pos === 'lj') {
            posGroup = 'mp_group';
        }

        let data;
        
        // อัปเดต Legend
        if (stage === 'pushfold') {
            const key = `pushfold-${posGroup}`;
            data = pushFoldRangeData[key] || pushFoldRangeData['pushfold-utg']; // Fallback
            // เปลี่ยน Legend
            chartLegend.innerHTML = `
                <span class="legend-shove">Shove (All-in)</span>
                <span class="legend-limp">Limp / Marginal</span>
                <span class="legend-fold">Fold</span>
            `;
        } else {
            const baseKey = `deep-${posGroup}`;
            const baseData = baseRangeData[baseKey] || baseRangeData['deep-utg']; // Fallback
            
            if (stage === 'deep') {
                data = baseData;
            } else {
                // สร้าง Chart ใหม่ตาม Stage
                data = modifyChartData(baseData, stage);
            }
            // Legend แบบปกติ
            chartLegend.innerHTML = `
                <span class="legend-raise">Raise (Default)</span>
                <span class="legend-shove">Raise (Strong)</span>
                <span class="legend-limp">Limp / Marginal</span>
                <span class="legend-fold">Fold</span>
            `;
        }

        // Update Title
        const stageText = stageSelect.options[stageSelect.selectedIndex].text;
        const posText = posSelect.options[posSelect.selectedIndex].text;
        chartTitle.textContent = `Range: ${stageText} - ${posText}`;

        // Clear existing grid
        rangeGrid.innerHTML = '';
        
        // สร้าง Grid
        for (let r = 0; r < 13; r++) {
            const row = rangeGrid.insertRow();
            for (let c = 0; c < 13; c++) {
                const cell = row.insertCell();
                cell.textContent = getHandName(r, c);
                
                let handType = 'F';
                if (data[r] && data[r][c]) {
                    handType = data[r][c];
                }
                
                cell.className = getHandClass(handType);
            }
        }
    }

    // Add event listeners to dropdowns
    stageSelect.addEventListener('change', updateRangeChart);
    posSelect.addEventListener('change', updateRangeChart);
    
    // Initial call
    updateRangeChart();


    // --- Tab 2: Push/Fold Helper Logic (Simplified) ---
    const pushFoldBtn = document.getElementById('push-fold-btn');
    const pushFoldResult = document.getElementById('push-fold-result');

    pushFoldBtn.addEventListener('click', () => {
        const stack = parseFloat(document.getElementById('push-stack').value);
        const position = document.getElementById('push-position').value;
        const action = document.getElementById('push-action').value;
        
        let rangeText = "";
        let resultClass = "";
        let actionTitle = "";

        if (isNaN(stack) || stack <= 0) {
            actionTitle = "ข้อมูลผิดพลาด";
            rangeText = "กรุณาใส่ Stack Size (BB) ให้ถูกต้อง";
            resultClass = "result-box-fold";
        } else {
            // (นี่คือ Logic ตัวอย่างแบบง่ายๆ)
            if (action === 'open-shove') {
                actionTitle = "Open Shove Range (ตัวอย่าง)";
                resultClass = "result-box-push";
                if (stack <= 10 && position === 'sb') {
                    rangeText = "K2s+, Q2s+, J2s+, T2s+, 92s+, 82s+, 72s+, 62s+, 52s+, 42s+, 32s, A2o+, K2o+, Q2o+, J2o+, T2o+, 93o+, 84o+, 75o+, 65o (ประมาณ 80-90%)";
                } else if (stack <= 12 && position === 'btn') {
                    rangeText = "22+, A2s+, K7s+, Q9s+, J9s+, T8s+, 98s, 87s, 76s, ATo+, KJo+, QJo (ประมาณ 40%)";
                } else if (stack <= 12 && (position === 'utg' || position === 'mp')) {
                    rangeText = "88+, ATs+, KQs, AQo+ (Range แคบมาก)";
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
                if (stack <= 25) { // 3-bet shove ได้ลึกกว่า open shove
                    rangeText = "TT+, AQs+, AKo (Value) / A5s, KJs (Bluff/Semi-Bluff) - Range นี้ต้องขึ้นอยู่กับตำแหน่งของคน Open Raise ด้วย";
                } else {
                    rangeText = "Stack ( > 25bb) อาจจะลึกเกินไปสำหรับ 3-Bet Shove (พิจารณา 3-Bet ปกติ)";
                    resultClass = "result-box-raise";
                }
            }
        }

        pushFoldResult.innerHTML = `<h3>${actionTitle}</h3><p class="${resultClass}">${rangeText}</p>`;
        pushFoldResult.style.display = 'block';
    });
});