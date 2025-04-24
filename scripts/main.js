// scripts/main.js
const Vars            = require("mindustry.Vars");
const Call            = require("mindustry.net.Call");
const Events          = require("mindustry.game.EventType");
const { BuildSelectEvent, ClientLoadEvent } = require("mindustry.game.EventType");
const { BaseDialog }  = require("mindustry.ui.dialogs");
const { TextButton, Styles } = require("mindustry.ui");

let menuOpened = false;
let toggles = {
  freeBuild: false,
  infiniteResources: false
};

// ▶ Add a little ⚙ button to the HUD
Events.on(ClientLoadEvent, () => {
  Vars.ui.hudGroup.addChild(() => {
    let btn = new TextButton("⚙ SCT", Styles.clearTogglei);
    btn.clicked(() => {
      if (!menuOpened) openMenu();
      else           dialog.hide();
      menuOpened = !menuOpened;
    });
    btn.top().left().margin(6);
    return btn;
  });
});

// ▶ Build the dialog
let dialog;
function openMenu(){
  dialog = new BaseDialog("SectorCheatTools");

  dialog.cont.check("Infinite Resources", toggles.infiniteResources, v => {
    toggles.infiniteResources = v;
    Vars.state.rules.infiniteResources = v;
  }).row();

  dialog.cont.check("Free Build", toggles.freeBuild, v => {
    toggles.freeBuild = v;
  }).row();

  dialog.cont.button("Capture Sector", () => {
    let sector = Vars.state.rules.sector;
    if (sector && !sector.hasBase()){
      sector.info.capture();
      Vars.ui.showInfoToast("[green]Sector captured!", 3);
    } else {
      Vars.ui.showInfoToast("[scarlet]Already captured or null", 3);
    }
  }).row();

  dialog.cont.button("Close", () => {
    dialog.hide();
    menuOpened = false;
  }).row();

  dialog.show();
}

// ▶ Hook free-build
Events.on(BuildSelectEvent, e => {
  if (toggles.freeBuild && !e.breaking && e.builder && e.builder.buildRequest){
    e.builder.buildRequest.freeBuild = true;
  }
});

// ▶ Keep resources infinite
Events.run(Trigger.update, () => {
  if (toggles.infiniteResources){
    let core = Vars.player.team().core();
    if (core) core.items().clear();
  }
});
