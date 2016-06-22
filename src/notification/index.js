import './notify.css';
import Localization from '../i18n'

var notifyTemplate = `
    <div class="notifications-tc">
        <div class="notification-info" >
            <div class="notification-icon-wrapper">
                <div class="notification-notify-icon">
                <div><div class="icon-el"><i class="fa fa-check-circle"></i></div>
                </div></div>
            </div>
            
            <div class="notification-info-body"><div class="notification-info-title"><div></div></div><div class="notification-info-msg" style="padding-top:15px; max-height: 60px;">#{message} </div></div>
            <span class="notification-close">×</span>
        </div>
</div>`
var notifyDiv;
var animateDiv;
var timeoutFn;
var hasClass = (ele, cls) => {
  return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

var addClass = (ele, cls) => {
  if (!hasClass(ele, cls)) {
    ele.className += " " + cls;
  }
}

var removeClass = (ele, cls) => {
  if (hasClass(ele, cls)) {
    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    ele.className = ele.className.replace(reg, ' ');
  }
}

var Notification = {
  create: (conf) => {
    notifyDiv = document.getElementById("notification");
    var message = conf.message;
    var type = conf.type;
    var timeout = conf.timeout;
    var title = Localization.get("notification.info");
    var bgClass = "info";
    if (type) {
      switch (type) {
        case "success":
          bgClass = "success";
          title = Localization.get("notification.success");
          break;
        case "error":
          bgClass = "error";
          title = Localization.get("notification.error");
          break;
        case "info":
          bgClass = "info";
          title = Localization.get("notification.info");
          break;
        case "warning":
          bgClass = "warning";
          title = Localization.get("notification.warning");
          break;
      }
    }
    var nhtml = notifyTemplate.replace("#{message}", message);
    // nhtml = nhtml.replace("#{title}", title);
    notifyDiv.innerHTML = nhtml;
    notifyDiv.querySelector(".notification-close").addEventListener("click", function() {
      addClass(animateDiv, "fadeOut");
      setTimeout(function() {
        notifyDiv.innerHTML = "";
      }, 200);
      clearTimeout(timeoutFn);
    })
    animateDiv = notifyDiv.querySelector(".notification-info");
    addClass(animateDiv, bgClass);

    addClass(animateDiv, "fadeInDown");
    setTimeout(function() {
      removeClass(animateDiv, "fadeInDown");
    }, 200);
    if (timeout <= 0) {
      return;
    }
    timeoutFn = setTimeout(function() {
      addClass(animateDiv, "fadeOut");
      setTimeout(function() {
        notifyDiv.innerHTML = "";
      }, 200);
    }, 3000);
  }
}
export default Notification
