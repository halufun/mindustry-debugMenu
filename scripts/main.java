package cheatmenu;

import arc.Core;
import arc.scene.ui.Dialog;
import arc.scene.ui.layout.Table;
import arc.struct.ObjectMap;
import mindustry.Vars;
import mindustry.content.UnitTypes;
import mindustry.game.Team;
import mindustry.game.Sector;
import mindustry.mod.Mod;
import mindustry.type.Item;
import mindustry.world.Tile;
import mindustry.world.blocks.storage.CoreBlock.CoreBuild;
import mindustry.gen.Unit;
import mindustry.world.blocks.storage.CoreBlock;
import mindustry.world.blocks.storage.CoreBlock.CoreBuild;

public class CheatMenuMod extends Mod {
    public CheatMenuMod() {
        // Called when mod is initialized
        System.out.println("CheatMenuMod loaded");
    }

    @Override
    public void init() {
        // Register keypress listener for opening menu (e.g., pressing 'C')
        Core.input.keyDown(Core.input.Keys.C, () -> {
            showMenu();
        });
    }

    private void showMenu() {
        Dialog dialog = new Dialog("Cheat Menu");
        Table table = dialog.cont;

        // Section: Add Resources
        table.label("Add Resources to Core").row();
        table.field("Amount", "1000", text -> {}).row();
        table.dropdown(Item.class, item -> item.name, item -> item, selectedItem -> {}, 200f).row();
        table.button("Give", () -> {
            int amount = Integer.parseInt(table.getCells().get(1).getActor().getText());
            Item selected = (Item) table.getCells().get(2).getActor().getSelected();
            // Add resources to closest core
            CoreBuild core = Vars.state.rules.getDefaultTeam() != null ? getPlayerCore() : null;
            if(core != null) core.items.add(selected, amount);
        }).row();

        // Section: Claim Sector
        table.button("Claim Sector", () -> {
            Sector sector = Vars.state.getSector();
            sector.owner = Vars.player.team();
        }).row();

        // Section: Spawn Units
        table.label("Spawn Units").row();
        table.dropdown(Team.class, team -> team.name(), t -> t, selectedTeam -> {}).row();
        table.dropdown(UnitTypes.class, u -> u.name, u -> u, selectedUnit -> {}).row();
        table.field("Count", "10", text -> {}).row();
        table.button("Spawn", () -> {
            Team spawnTeam = (Team) table.getCells().get(??).getActor().getSelected();
            UnitTypes type = (UnitTypes) table.getCells().get(??).getActor().getSelected();
            int count = Integer.parseInt(table.getCells().get(??).getActor().getText());
            for(int i = 0; i < count; i++) {
                Unit unit = type.create(spawnTeam);
                unit.set(Vars.player.x, Vars.player.y);
                unit.add();
            }
        }).row();

        // Section: Instabuild Toggle
        table.button("Toggle Instabuild", () -> {
            boolean active = Vars.state.rules.infiniteResources;
            Vars.state.rules.infiniteResources = !active;
        }).row();

        dialog.button("Close", dialog::hide);
        dialog.show();
    }

    private CoreBuild getPlayerCore() {
        return Vars.world.tileWorld(Vars.player.x, Vars.player.y)
                .entities.filter(e -> e instanceof CoreBuild)
                .first();
    }
}
