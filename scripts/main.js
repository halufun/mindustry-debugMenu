// scripts/cheat.js

// Global classes and helpers (Core, Vars, Groups, Dialog, etc.) are already injected
// No Java.type() calls required

function showMenu() {
  const dialog      = new Dialog("Cheat Menu");
  const cont        = dialog.content;

  // ── Add Resources ─────────────────────────────────
  cont.add("Add Resources to Core").row();
  const amountField = new TextField("1000");
  cont.add(amountField).row();
  const itemSelect  = new Select(Vars.content.items());
  cont.add(itemSelect).row();
  cont.add(new TextButton("Give", () => {
    const amount = parseInt(amountField.getText());
    const item   = itemSelect.getSelected();
    const core   = findNearestCore();
    if (core) core.items.add(item, amount);
  })).row();

  // ── Claim Sector ──────────────────────────────────
  cont.add(new TextButton("Claim Sector", () => {
    Vars.state.getSector().owner = Vars.player.team();
  })).row();

  // ── Spawn Units ───────────────────────────────────
  cont.add("Spawn Units").row();
  const teamSelect  = new Select(Vars.content.teams());
  cont.add(teamSelect).row();
  const unitSelect  = new Select(Vars.content.units());
  cont.add(unitSelect).row();
  const countField  = new TextField("10");
  cont.add(countField).row();
  cont.add(new TextButton("Spawn", () => {
    const team  = teamSelect.getSelected();
    const type  = unitSelect.getSelected();
    const cnt   = parseInt(countField.getText());
    for (let i = 0; i < cnt; i++) {
      const u = type.create(team);
      u.set(Vars.player.x, Vars.player.y);
      u.add();
    }
  })).row();

  // ── Instabuild Toggle ────────────────────────────
  cont.add(new TextButton("Toggle Instabuild", () => {
    Vars.state.rules.infiniteResources = !Vars.state.rules.infiniteResources;
  })).row();

  dialog.addCloseButton();
  dialog.show();
}

// Helper: locate the nearest core on the player’s team
function findNearestCore() {
  let closest = null;
  Groups.build.each(b => {
    if (b instanceof CoreBlock.CoreBuild && b.team === Vars.player.team()) {
      if (!closest || b.dst(Vars.player) < closest.dst(Vars.player)) {
        closest = b;
      }
    }
  });
  return closest;
}

// Bind the 'C' key to open the cheat menu
input.keyDown(Keycode.C, showMenu);
