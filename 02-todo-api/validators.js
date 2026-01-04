function validateTitle(title){
    return title && title.trim() !== "";
}

module.exports = { validateTitle };
