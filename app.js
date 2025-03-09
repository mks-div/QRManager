
const { ipcRenderer } = require('electron')
const QRCode = require('qrcode')
const fs = require('fs');

const root = document.documentElement;

const resizableInfo = document.getElementById('info-down')

const resizeInfoHandle = document.getElementById('info-down-resize')
const output = document.getElementById('textInput') 

const resizableSettings = document.getElementById('settings-left')
const resizeSettingsHandle = document.getElementById('settings-left-handler')

const canvas = document.getElementById('canvas')
const canvasHolder = document.getElementById('canvas-holder');                                                                                                                                                                                                       
const QrHolder = document.getElementById('qr-holder')

let canvasHeight = parseFloat(window.getComputedStyle(canvasHolder).height)


let QRCodeLight = '#ffffff', QrCodeDark = '#000000'
let IsCanvasEmpty = true;


j = true
z = true

let ToSave = [ resizeInfoHandle.offsetHeight, resizableSettings.offsetWidth ]
document.getElementById("borders").innerHTML = ToSave[0] + '|' + ToSave[1] 

let resizableObject
let resizeHandle

let isResizing = false
let isResCollapsed = false
let lastMinVal = 0

let axis = "X"

let startX, startY, startWidth, startHeight


// additional functions
document.addEventListener('dragstart', function(e) { e.preventDefault() })


function getLimitsInPixels(element) {
    CS = window.getComputedStyle(element)
    // io = CS.maxHeight
    // oi = CS.minHeight
    // console.log(parseInt(window.getComputedStyle(element.parentNode).height), "/", CS.maxHeight.slice(-1), io )
    if (CS.maxHeight && CS.minHeight && CS.maxWidth && CS.minWidth) {
        //console.log(CS.maxHeight, CS.minHeight, CS.maxWidth, CS.minWidth)
        return  [
            (CS.maxHeight.slice(-1)  === 'x' ? parseFloat(CS.maxHeight) : parseFloat(CS.maxHeight) / 100 * parseFloat(window.getComputedStyle(element.parentNode).height) ),
            (CS.maxWidth.slice(-1)  === 'x' ? parseFloat(CS.maxWidth) : parseFloat(CS.maxWidth) / 100 * parseFloat(window.getComputedStyle(element.parentNode).width) ) 
        ]
    }
}
function closesettings() {
    lastMinVal = parseInt(window.getComputedStyle(resizableSettings).minWidth);
    root.style.setProperty('--settings-width', `${0}px`)
    root.style.setProperty('--settings-min-width', `${0}px`)
    resizableSettings.style.visibility = "hidden";
}

function opensettings() {

    root.style.setProperty('--settings-min-width', `${lastMinVal}px`)
    root.style.setProperty('--settings-width', `${lastMinVal}px`)
    resizableSettings.style.visibility = "visible";
    lastMinVal = 0
}

function checksplitterssize() {
    Info = checkSize(resizableInfo)
    Settings = checkSize(resizableSettings)
    // console.log(Info, '/n|',  Settings)
    // console.log(Info[0])

    if (parseInt(root.style.getPropertyValue("--qr-info-height")) >= Info[0]) root.style.setProperty('--qr-info-height', `${Info[0]}px`)
    if (parseInt(root.style.getPropertyValue("--settings-width")) >= Settings[1]) root.style.setProperty('--settings-width', `${Settings[1]}px`)
}


// colorInputs
const DarkcolorPicker = document.getElementById('DarkColorPicker');
const DarkhexInput = document.getElementById('DarkHexInput');
DarkcolorPicker.addEventListener('input', function() {
    QrCodeDark = DarkhexInput.value = DarkcolorPicker.value; 
    ResizeQR();
});
DarkhexInput.addEventListener('input', function() {
    const value = DarkhexInput.value;
    if ( /^#[0-9A-Fa-f]{6}$/.test(value) ) QrCodeDark = DarkcolorPicker.value = value; // Проверка на корректный HEX-код
    ResizeQR(); 
});


const LightcolorPicker = document.getElementById('LightColorPicker');
const LighthexInput = document.getElementById('LightHexInput');
LightcolorPicker.addEventListener('input', function() { 
    QRCodeLight = LighthexInput.value = LightcolorPicker.value; 
    ResizeQR();
});
LighthexInput.addEventListener('input', function() { 
    if (/^#[0-9A-Fa-f]{6}$/.test(LighthexInput.value)) QRCodeLight = LightcolorPicker.value = LighthexInput.value
    ResizeQR();
});

    

function checkSize(element, isHorizontal=true) {
    if (isHorizontal ) {
        return getLimitsInPixels(element)
    } else {

    }
}
function preprocessImage(imageData) {
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i]     // красный 
        const g = data[i + 1] // зелёный 
        const b = data[i + 2] // синий 

        const gray = 0.299 * r + 0.587 * g + 0.114 * b // преобразование в оттенки серого 

        const threshold = 128 
        const binary = gray > threshold ? 255 : 0

        data[i] = data[i + 1] = data[i + 2] = binary // Запись результата
    }

    return imageData
}

function invertColors(imageData) {
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i]         // красный канал
        data[i + 1] = 255 - data[i + 1] // зелёный канал
        data[i + 2] = 255 - data[i + 2] // синий канал
    } return imageData
}

function GetQrInfo(imageData) { // processed to input
    const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'attemptBoth' })
    if (code) return code.data
    else return 'код не найден' 
}

function PrintQR(QRInfo) {
    if (QRInfo) {
        IsCanvasEmpty = false;
        if (QRInfo !== "код не найден") {
            QRCode.toCanvas(canvas, QRInfo, {
                width: canvasHeight, 
                color: { dark: QrCodeDark, light: QRCodeLight }
                }, (error) => { if (error) console.error(error) }
            )
            return 0
        } 
    }
    IsCanvasEmpty = true;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
}

function ResizeQR() {
    document.documentElement.style.setProperty(
        '--qr-height',
        `${Math.min(
            parseFloat(window.getComputedStyle(QrHolder).height),
            parseFloat(window.getComputedStyle(QrHolder).width)
        )}px`
    );
    canvasHeight = parseFloat(getComputedStyle(canvasHolder).height);
    PrintQR(output.value)
}


// buttons
document.getElementById('Tbtn-1').addEventListener('click', () => {
    ipcRenderer.send('close-window'); 
});

document.getElementById('Tbtn-2').addEventListener('click', () => {

    ipcRenderer.send('maximize-window'); 
    if (z) { // unmax
        document.getElementById("Tbtn-2-open").style.visibility = "hidden";
        document.getElementById("Tbtn-2-close").style.visibility = "visible";
    }
    else { // max
        document.getElementById("Tbtn-2-open").style.visibility = "visible";
        document.getElementById("Tbtn-2-close").style.visibility = "hidden";
    }
    z = !z;
});
// |
// v
ipcRenderer.on('maximized', () => {
    checksplitterssize()
})

document.getElementById('Tbtn-3').addEventListener('click', () => {
    ipcRenderer.send('minimize-window'); 
});

document.getElementById('Tbtn-4').addEventListener('click', () => { ipcRenderer.send('dialog:openFile') });  
// |
// v
ipcRenderer.on('file-selected', (event, filePath) => {
    if (filePath) {
        const image = new Image() // Создаем объект изображения
        image.src = filePath

        image.onload = () => {
            const context = canvas.getContext('2d')
            canvas.width = image.width
            canvas.height = image.height
            context.drawImage(image, 0, 0, canvas.width, canvas.height)

            const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

            output.value = GetQrInfo(preprocessImage(imageData))
            PrintQR(output.value)
        }
    } else {
        output.innerText = 'Файл не выбран'
    }
})
// |
// v
output.addEventListener('input', function (evt) {
    PrintQR(output.value)
});

// document.getElementById("btn-l3").onclick = function() {
//     j = !j
//     if (j) { 
//         document.getElementsByClassName("additional-info")[0].style.visibility = "visible"
//         document.getElementsByClassName("additional-info")[0].style.height = `${20}px`
//     }
//     else {
//         document.getElementsByClassName("additional-info")[0].style.visibility = "hidden"
//         document.getElementsByClassName("additional-info")[0].style.height = `${0}px`
//     }

// }
document.getElementById("btn-l2").onclick = function() { 
    if (lastMinVal) {
        isResCollapsed = false
        opensettings();
    }
    else {
        //console.log(document.activeElement);
        isResCollapsed = true
        document.activeElement.blur()
        closesettings(); 
    }
}


document.getElementById("btn-l4").onclick = function() { 
    ipcRenderer.send('dialog:saveFile') 
}
// |
// v
ipcRenderer.on('save-path-selected', (event, filePath) => { 
    
    if (!IsCanvasEmpty) {
        // получение расширения файла
        temp = ""
        for (let i = (filePath.length === 0 ? 0 : filePath.length - 1); i >= 0 && filePath[i] != '.'; i--) { temp = filePath[i] + temp }

        //console.log(filePath, temp, IsCanvasEmpty) 
   
        if (temp === "png") {
            const imageData = canvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, '');

            fs.writeFile(filePath, imageData, 'base64', (err) => {})
            return 0
        }
        if (temp === "jpg" || temp === "jpeg") {
            const imageData = canvas.toDataURL('image/jpeg', 0.9).replace(/^data:image\/jpeg;base64,/, '');

            fs.writeFile(filePath, imageData, 'base64', (err) => {})
            return 0
        }
        
        else { ipcRenderer.send('dialog:ERR', "File extension is not supported"); return 1}
    } else { ipcRenderer.send('dialog:ERR', "No QR to save"); return 1}
})
    




// qr resize
window.addEventListener('resize', () => { ResizeQR(); checksplitterssize() })
const resizeObserver = new ResizeObserver(entries => {
  for (let entry of entries) { ResizeQR();  }
  
}); resizeObserver.observe(QrHolder)


// resizing sliders
resizeInfoHandle.addEventListener('mousedown', (e) => {
    resizableObject = resizableInfo
    resizeHandle = resizeInfoHandle

    resizeHandle.style.backgroundColor = "red"
    isResizing = true
    axis="Y"
    startY = e.clientY // Начальная позиция курсора по Y
    lastSizeVal = e.clientY 

    startHeight = parseInt(document.defaultView.getComputedStyle(resizableObject).height, 10) // Начальная высота
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
});

resizeSettingsHandle.addEventListener('mousedown', (e) => {
    resizableObject = resizableSettings
    resizeHandle = resizeSettingsHandle

    resizeHandle.style.backgroundColor = "red"
    isResizing = true
    axis="X"
    startX = e.clientX // Начальная позиция курсора по X
    lastSizeVal = e.clientX

    startWidth = parseInt(document.defaultView.getComputedStyle(resizableObject).width, 10) // Начальная ширина
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
});

function handleMouseMove(e) {
    if (isResizing) {
        // Вычисляем новую ширину и высоту

        cs = window.getComputedStyle(resizableObject)
        if (axis === "X") {          
            const temp = (e.clientX - startX)
            const newWidth = startWidth + temp
            console.log(cs.maxWidth, lastMinVal, '|', e.clientX, startX, startWidth, "|", isResCollapsed, "/", root.style.getPropertyValue('--settings-width'), root.style.getPropertyValue('--settings-min-width'))

            if (newWidth <= parseInt(cs.minWidth) * 0.3 && !isResCollapsed) {
                //lastMinVal = parseInt(cs.minWidth); console.error("here")
                isResCollapsed = true
                closesettings()
            }
            else if (isResCollapsed && newWidth >= lastMinVal * 0.6) {
                isResCollapsed = false
                opensettings()
            }
            else if (!isResCollapsed && newWidth <= parseInt(cs.maxWidth) / 100 * parseInt(window.getComputedStyle(document.getElementById('work-zone')).width) && newWidth > parseInt(cs.minWidth)) {
                root.style.setProperty('--settings-width', `${newWidth}px`)
            }

        }

        else if (axis === "Y") {
            
            const temp = (e.clientY - startY)
            const newHeight = startHeight - temp

            const current_maxh = parseInt(cs.maxHeight) / 100 * parseFloat(window.getComputedStyle(document.getElementById('main-obj')).height)


            
            if (newHeight < parseInt(cs.minHeight)) {
                root.style.setProperty('--qr-info-height', `${parseFloat(cs.minHeight)}px`)
            }
            else if (newHeight > current_maxh) {
                root.style.setProperty('--qr-info-height', `${current_maxh}px`)
            }
            else {
                root.style.setProperty('--qr-info-height', `${newHeight}px`)
            } 
        }

    }
}

function handleMouseUp() {
    console.error("!")
    isResizing = false
    lastSizeVal = 0
    
    resizeHandle.style.backgroundColor = "transparent"
    resizeHandle = null
    resizableObject = null

    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
}
