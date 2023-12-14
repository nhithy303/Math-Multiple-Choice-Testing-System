module.exports = {
    increaseIndex: (index) => {
        return index + 1;
    },
    createQuestionsTable: (questions) => {
        let htmlStr = '<table>'
        const cols = 5
        const rows = Math.ceil(questions / cols)
        let cell = 1
        for (let i = 0; i < rows; i++) {
            htmlStr += '<tr>'
            for (let j = 0; j < cols; j++) {
                htmlStr += `<td>${cell}</td>`
                cell++
            }
            htmlStr += '</tr>'
        }
        htmlStr += '</table>'
        return htmlStr
    }
}