// scripts/main.js

// --- state ---
let menuOpened = false;
const toggles = {
  freeBuild: false,
  infiniteResources: false
};
let dialog;

// --- HUD button on client load ---
Events.on(ClientLoadEvent, () => {
  Vars.ui.hudGroup.addChild(() => {
    const btn = new TextButton("⚙ SCT", Styles.clearTogglei);
    btn.clicked(() => {
      if (!menuOpened) {
        openMenu();
      } else {
        dialog.hide();
      }
      menuOpened = !menuOpened;
    });
    btn.top().left().margin(6);
    return btn;
  });
});

// --- build and show the dialog ---
function openMenu() {
  dialog = new BaseDialog("SectorCheatTools");
  dialog.addCloseButton();

  // content
  dialog.cont
    .check("Infinite Resources", toggles.infiniteResources, v => {
      toggles.infiniteResources = v;
      Vars.state.rules.infiniteResources = v;
    }).row()
    .check("Free Build", toggles.freeBuild, v => {
      toggles.freeBuild = v;
    }).row()
    .button("Capture Sector", () => {
      const sector = Vars.state.rules.sector;
      if (sector && !sector.hasBase()) {
        sector.info.capture();
        Vars.ui.showInfoToast("[green]Sector captured!", 3);
      } else {
        Vars.ui.showInfoToast("[scarlet]Already captured or null", 3);
      }
    }).row();

  dialog.show();
}

// --- free-build hook ---
Events.on(BuildSelectEvent, e => {
  if (toggles.freeBuild && !e.breaking && e.builder?.buildRequest) {
    e.builder.buildRequest.freeBuild = true;
  }
});

// --- infinite resources every tick ---
Events.run(Trigger.update, () => {
  if (toggles.infiniteResources) {
    const core = Vars.player.team().core();
    if (core) core.items().clear();
  }
});
