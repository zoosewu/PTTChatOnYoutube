export let ConnectLogin = {
  template: `<div class="form-row mb-2">
  <div class="col-5">
    <label for="PTTid">PTT ID</label>
    <input id="PTTid" type="text" class="form-control" placeholder="PTT ID" autocomplete="off">
  </div>
  <div class="col-5">
    <label for="PTTpw">PTT密碼</label>
    <input id="PTTpw" type="password" class="form-control" placeholder="PTT密碼" autocomplete="off">
  </div>
  <div class="col-2">
    <label for="PTTlogin" class="col-2">　</label>
    <button id="PTTlogin" type="button" class="btn ptttext border btn-outline-secondary">登入</button>
  </div>
</div>`,
}