(function build(){
    const path = require('path'),
        fs = require('fs');
    const { resolve } = require('path');
    const { readdir } = require('fs').promises; // промифицированная версия функций из метода

    /**Рабочие переменные*/
    const buildDirs = [
        'api',
        'npm',
        'files',
        'sert',
    ]

    /**
     *
     * @param {stirng} dir папка, с которой начинается сканирование
     * @returns {Promise<stirng[]>}
     */
    async function getFiles(dir) {
        // читаем содержимое директории

        if (
           dir === `${path.join(`${__dirname}/../`)}node_modules`
        || dir === `${path.join(`${__dirname}/../`)}.git`
        || dir === `${path.join(`${__dirname}/../`)}.idea`
        || dir === `${path.join(`${__dirname}/../`)}sert`
        || dir === `${path.join(`${__dirname}/../`)}node_modules`
        || dir === `${path.join(`${__dirname}/../`)}files`
        || dir === `${path.join(`${__dirname}/../`)}build`){
        }else {
            const dirents = await readdir(dir, { withFileTypes: true });

            const files = await Promise.all(dirents.map((dirent) => {
                const res = resolve(dir, dirent.name);
                return dirent.isDirectory() ? getFiles(res) : res;
            }));
            return Array.prototype.concat(...files);
        }
    }
    
    async function building_files(files_array) {
        files_array.forEach((file) => {
            let a = file.split(`\\`);
            if (a[a.length-1].split('.')[1] === 'js'){
                //console.log(file)
                //fs
                fs.readFile(file, {}, function (err, data) {
                    if (err)
                        console.log(err)

                    console.log(path.resolve(`${__dirname}../../project_build`))
                })
            }
        })
        // Очистка папки project_build --> Собираем папки
        fs.exists(path.resolve(`${__dirname}../../project_build`), function (exists) {
            // Если папка уже есть --> Чистим
            // Иначе --> Продолжаем сразу
            if (exists === true){
                fs.rm(path.resolve(`${__dirname}../../project_build/`), function () {
                    console.log(1)
                })
            }

            buildDirs.forEach((directory_name) => {
                fs.mkdir(path.resolve(`${__dirname}../../project_build/${directory_name}`),
                    { recursive: true },
                    function (err) {
                        if (err)
                            console.log(err)
                    })
            })
        })
    }

    async function buildFullFiles () {

    }

// тестируем
    getFiles(path.join(`${__dirname}/../`))
        .then(files => {console.log(files.filter(v => v))
            return files.filter(v => v)})
        .then(res => building_files(res))
        .catch(err => console.error(err))
}.call(this))