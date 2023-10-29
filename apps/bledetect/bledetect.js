let menu = {
  "": { "title": "BLE Detector" },
  "RE-SCAN":  () => scan()
};

function showMainMenu() {
  menu["< Back"] =  () => load();
  Bangle.drawWidgets();
  return E.showMenu(menu);
}

function showDeviceInfo(device){
  const deviceMenu = {
    "": { "title": "Device Info" },
    "name": {
      value: device.name
    },
    "rssi": {
      value: device.rssi
    },
    "manufacturer": {
      value: device.manufacturer===undefined ? "-" : device.manufacturer
    }
  };

  deviceMenu[device.id] = () => {};
  deviceMenu["< Back"] =  () => showMainMenu();

  return E.showMenu(deviceMenu);
}

function save(deviceIds){
  var date = new Date();
  const dateStr = `${date.getDate()}-${date.getMonth()}-${date.getHours()}-${date.getMinutes()}`;
  var file = require("Storage").open(`recognisedBTIds-${dateStr}.csv`,"a");
  deviceIds.forEach(id => {
    file.write(id+"\n");
  });
  console.log(`saved file recognisedBTIds-${dateStr} with ${deviceIds.length} bluetooth ids`);
}

function scan() {
  deviceIds = [];
  menu = {
    "": { "title": "BLE Detector" },
    "RE-SCAN":  () => scan(),
    "save": () => save(deviceIds)
  };

  waitMessage();

  NRF.findDevices(devices => {
    devices.forEach(device =>{
      let deviceName = device.id.substring(0,17);

      if (device.name) {
        deviceName = device.name;
      }
      deviceIds.push(device.id);
      menu[deviceName] = () => showDeviceInfo(device);
    });
    showMainMenu(menu);
  }, 5000);
}

function waitMessage() {
  E.showMenu();
  E.showMessage("scanning");
}

Bangle.loadWidgets();
scan();
waitMessage();
