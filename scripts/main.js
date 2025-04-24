const Vars = require("arc.Core").app;
const Call = require("mindustry.net.Call");
const Player = require("mindustry.gen.Player");
const ui = Vars.ui;
let menuOpened = false;

let toggles = {
    freeBuild: false,
    infiniteResources: false
};

// UI button to open menu
Events.on(ClientLoadEvent, e => {
    Vars.ui.hudGroup.addChild(() => {
        let b = new TextButton("⚙ SCT", Styles.clearTogglei);
        b.clicked(() => {
            if (!menuOpened) openMenu();
            menuOpened = !menuOpened;
        });
        b.top().left().margin(6);
        return b;
    });
});

// Main menu UI
function openMenu() {
    let dialog = new BaseDialog("SectorCheatTools");

    dialog.cont.check("Infinite Resources", toggles.infiniteResources, val => {
        toggles.infiniteResources = val;
        Vars.state.rules.infiniteResources = val;
    }).row();

    dialog.cont.check("Free Build", toggles.freeBuild, val => {
        toggles.freeBuild = val;
    }).row();

    dialog.cont.button("Capture Sector", () => {
        let sector = Vars.state.rules.sector;
        if (sector != null && !sector.hasBase()) {
            sector.info.capture();
            Vars.ui.showInfoToast("[green]Sector captured!", 3);
        } else {
            Vars.ui.showInfoToast("[scarlet]Already captured or null", 3);
        }
    }).row();

    dialog.cont.button("Close", dialog.hide).row();

    dialog.show();
}

// Free build handler
Events.on(BuildSelectEvent, e => {
    if (toggles.freeBuild && !e.breaking && e.builder != null && e.builder.buildRequest != null) {
        e.builder.buildRequest.freeBuild = true;
    }
});

// Infinite resource handler
Events.run(Trigger.update, () => {
    if (toggles.infiniteResources) {
        let team = Vars.player.team();
        if (team.core()) {
            team.core().items().clear();
        }
    }
});
