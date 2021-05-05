const readline = require('readline');
const fs = require('fs')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '收入：in  支出：out  账单：show\n'
});

function fn_recordMoney (mObj) {
    if (isIn) {
        data.收入.push(mObj);
    }
    else {
        data.支出.push(mObj);
    }
    fs.writeFileSync('./myMoney/money.json', JSON.stringify(data,null,4));
}

function fn_money () {
    let mObj = {};
    rl.question('金额: ', (input) => {
        if (isIn) {
            mObj.金额 = input;
        }
        else {
            mObj.金额 = -input;
        }
        rl.question('描述: ', (input) => {
            mObj.描述 = input;
            let myType = JSON.parse(fs.readFileSync('./myMoney/type.json','utf-8'));
            let str = '类型';
            myType.type.forEach((item, index) => {
                str = `${str}  ${index + 1}.${item}` ;
            });
            rl.question(str + '\n', (input) => {
                mObj.类型 = input;
                myType.type.push(input);
                myType.type = [...new Set(myType.type)];
                fs.writeFileSync('./myMoney/type.json', JSON.stringify(myType, null, 4));
                rl.question('时间: ', (input) => {
                    mObj.时间 = input;
                    console.log(mObj);
                    //fn_recordMoney(mObj);
                    money = parseFloat(mObj.金额) + parseFloat(money);
                    rl.write(`余额为：${money}\n`);
                    rl.prompt();
                })
            })
        })
    })
}

function fn_remainMoney () {
    let money = 0;
    for (let i in data) {
        for (let j of data[i]) {
            money += parseFloat(j.金额)
        }
    }
    return money.toFixed(2)
}

function fn_showMoney () {
    let myType = JSON.parse(fs.readFileSync('./myMoney/type.json','utf-8'));
    let str = '0.全部';
    myType.type.forEach((item, index) => {
        str = `${str}  ${index + 1}.${item}` ;
    });
    rl.question(str + '\n', (input) => {
        let incomeArr,payArr;
        if (input === '0') {
            incomeArr = data.收入;
            payArr = data.支出;
        }
        else {
            incomeArr = data.收入.filter((item) => {
                if (item.类型 == myType.type[input-1]) {
                    return true
                };
            });
            payArr = data.支出.filter((item) => {
                if (item.类型 === myType.type[input-1]) {
                    return true
                };
            })
        };
        rl.question('0.全部  1.收入  2.支出\n', (input) => {
            if (input === '0') {
                for (let item of incomeArr) {
                    console.log(item);
                }
                for (let item of payArr) {
                    console.log((item));
                }
            }
            else if (input === '1') {
                for (let item of incomeArr) {
                    console.log(item);
                }
            }
            else if (input === '2') {
                for (let item of payArr) {
                    console.log((item));
                }
            };
            rl.prompt();
        })
    })
}

let data = JSON.parse(fs.readFileSync('./myMoney/money.json','utf-8'));
let money = fn_remainMoney();
let isIn;


rl.write(`余额为：${money}\n`);
rl.on('line', (input) => {
    if (input === 'in') {
        isIn = true;
        fn_money()
    }
    else if (input === 'out') {
        isIn = false;
        fn_money();
    }
    else if (input === 'show') {
        fn_showMoney();
    }
})
