// scripts/main.js

// --- state ---
var menuOpened = false;
var toggles = {
    freeBuild: false,
    infiniteResources: false
};
var dialog;

// --- HUD button on client load ---
Events.on(ClientLoadEvent, function() {
    Vars.ui.hudGroup.addChild(function() {
        var btn = new TextButton("⚙ SCT", Styles.clearTogglei);
        btn.clicked(function() {
            if(!menuOpened) {
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

    dialog.cont
        .check("Infinite Resources", toggles.infiniteResources, function(v) {
            toggles.infiniteResources = v;
            Vars.state.rules.infiniteResources = v;
        }).row()
        .check("Free Build", toggles.freeBuild, function(v) {
            toggles.freeBuild = v;
        }).row()
        .button("Capture Sector", function() {
            var sector = Vars.state.rules.sector;
            if(sector && !sector.hasBase()) {
                sector.info.capture();
                Vars.ui.showInfoToast("[green]Sector captured!", 3);
            } else {
                Vars.ui.showInfoToast("[scarlet]Already captured or null", 3);
            }
        }).row();

    dialog.show();
}

// --- free-build hook ---
Events.on(BuildSelectEvent, function(e) {
    if(toggles.freeBuild && !e.breaking && e.builder && e.builder.buildRequest) {
        e.builder.buildRequest.freeBuild = true;
    }
});

// --- infinite resources every tick ---
Events.run(Trigger.update, function() {
    if(toggles.infiniteResources) {
        var core = Vars.player.team().core();
        if(core) core.items().clear();
    }
});
