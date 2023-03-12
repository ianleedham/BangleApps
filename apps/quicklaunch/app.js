{
  const storage = require("Storage");
  let settings = storage.readJSON("quicklaunch.json", true) || {};

  let reset = function(name){
    if (!settings[name]) settings[name] = {"name":"(none)"};
    if (!storage.read(settings[name].src)) settings[name] = {"name":"(none)"};
    storage.write("quicklaunch.json", settings);
  };

  let leaveTrace = function(trace) {
    settings.trace = trace;
    storage.writeJSON("quicklaunch.json", settings);
    return trace;
  };

  let trace = settings.trace;

  let touchHandler = (_,e) => {
    let R = Bangle.appRect;
    if (e.x < R.x || e.x > R.x2 || e.y < R.y || e.y > R.y2 ) return;
    trace = leaveTrace(trace+"t");
    if (settings[trace+"app"].src){ if (settings[trace+"app"].name == "Show Launcher") Bangle.showLauncher(); else if (!storage.read(settings[trace+"app"].src)) reset(trace+"app"); else load(settings[trace+"app"].src); }
  };

  let swipeHandler = (lr,ud) => {
    if (lr == -1) trace = leaveTrace(trace+"l"); // l=left, 
    if (lr == 1) trace = leaveTrace(trace+"r"); // r=right,
    if (ud == -1) trace = leaveTrace(trace+"u"); // u=up,
    if (ud == 1) trace = leaveTrace(trace+"d"); // d=down.
    if (lr == -1 && settings[trace+"app"] && settings[trace+"app"].src){ if (settings[trace+"app"].name == "Show Launcher") Bangle.showLauncher(); else if (!storage.read(settings[trace+"app"].src)) reset(trace+"app"); else load(settings[trace+"app"].src); }
    if (lr == 1 && settings[trace+"app"] && settings[trace+"app"].src){ if (settings[trace+"app"].name == "Show Launcher") Bangle.showLauncher(); else if (!storage.read(settings[trace+"app"].src)) reset(trace+"app"); else load(settings[trace+"app"].src); }
    if (ud == -1 && settings[trace+"app"] && settings[trace+"app"].src){ if (settings[trace+"app"].name == "Show Launcher") Bangle.showLauncher(); else if (!storage.read(settings[trace+"app"].src)) reset(trace+"app"); else load(settings[trace+"app"].src); }
    if (ud == 1 && settings[trace+"app"] && settings[trace+"app"].src){ if (settings[trace+"app"].name == "Show Launcher") Bangle.showLauncher(); else if (!storage.read(settings[trace+"app"].src)) reset(trace+"app"); else load(settings[trace+"app"].src); }
  };

  Bangle.setUI({
    mode: "custom",
    touch: touchHandler,
    swipe : swipeHandler,
    remove: ()=>{if (timeoutToClock) clearTimeout(timeoutToClock);} // Compatibility with Fastload Utils.
  });

  g.clearRect(Bangle.appRect);
  Bangle.loadWidgets(); // Compatibility with Fastload Utils.

  // taken from Icon Launcher with some alterations
  let timeoutToClock;
  const updateTimeoutToClock = function(){
    let time = 1000; // milliseconds
    if (timeoutToClock) clearTimeout(timeoutToClock);
    timeoutToClock = setTimeout(load,time);
  };
  updateTimeoutToClock();
  
  let R = Bangle.appRect; 
  
  // Draw app hints
  g.setFont("Vector", 11)
    .setFontAlign(0,1,3).drawString(settings[trace+"lapp"].name, R.x2, R.y+R.h/2)
    .setFontAlign(0,1,1).drawString(settings[trace+"rapp"].name, R.x, R.y+R.h/2)
    .setFontAlign(0,1,0).drawString(settings[trace+"uapp"].name, R.x+R.w/2, R.y2)
    .setFontAlign(0,-1,0).drawString(settings[trace+"dapp"].name, R.x+R.w/2, R.y)
    .setFontAlign(0,0,0).drawString(settings[trace+"tapp"].name, R.x+R.w/2, R.y+R.h/2);
}
