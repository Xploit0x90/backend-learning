function validateTitle(title){
    return title && title.trim() !== "";
}

function validateContent(title){
    return title && title.trim() !== "";
}

module.exports = {validateTitle, validateContent};