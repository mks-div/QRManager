; Имя приложения
#define   Name       "QRManager"
; Версия приложения
#define   Version    "0.0.1"
; Фирма-разработчик
#define   Publisher  "mks-div"
; Сафт фирмы разработчика
#define   URL        "http://www.nuclear-winter.com"
; Имя исполняемого модуля
#define   ExeName    "QMInstaller.exe"


[Setup]
AppName=QRManager
AppVersion=1.0
DefaultDirName={pf}\QRManager
DefaultGroupName=QRManager
OutputDir=.\Output  
OutputBaseFilename=QMInstaller  
SetupIconFile=.\ICON.ico  
UninstallDisplayIcon={app}\QMInstaller.exe  

AppId={{98037193-0D47-4B28-9D99-C124A1B7409C}

; Прочая информация, отображаемая при установке
; AppName={#Name}
; AppVersion={#Version}
AppPublisher={#Publisher}
AppPublisherURL={#URL}
AppSupportURL={#URL}
AppUpdatesURL={#URL}

; Путь установки по-умолчанию
//DefaultDirName={pf}\{#Name}
; Имя группы в меню "Пуск"
//DefaultGroupName={#Name}

; Каталог, куда будет записан собранный setup и имя исполняемого файла

//OutputBaseFileName=QM
; Файл иконки
; SetupIconFile="ICON.ico"

; Параметры сжатия
Compression=lzma
SolidCompression=yes

[Languages]
Name: "russian"; MessagesFile: "compiler:Languages\Russian.isl"; LicenseFile: "RUS.txt"


[Icons]
Name: "{userdesktop}\QRManager"; Filename: "{app}\QRManager.exe"


[Files]

Source: "..\dist\QRManager-win32-x64\QRManager.exe"; DestDir: "{app}"; Flags: ignoreversion


Source: "..\dist\QRManager-win32-x64\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: ".\ICON.ico"; DestDir: "{app}"; Flags: ignoreversion