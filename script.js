/* ============================================================
   Rajo Mental Health Education and Support — Donation Page
   ============================================================ */

'use strict';

/* ===== Clipboard helper (with fallback for older browsers) ===== */
function writeToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(textarea);
            resolve();
        } catch (err) {
            document.body.removeChild(textarea);
            reject(err);
        }
    });
}

/* ===== Toast notification ===== */
var toastTimer = null;

function showToast(message) {
    var toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
        toast.classList.remove('show');
    }, 3000);
}

/* ===== Temporarily change a button to a success state ===== */
var CHECK_SVG = '<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';

function flashSuccess(btn, successLabel) {
    var originalHTML = btn.innerHTML;
    btn.innerHTML = CHECK_SVG + '<span class="btn-label">' + successLabel + '</span>';
    btn.classList.add('copied');
    setTimeout(function () {
        btn.innerHTML = originalHTML;
        btn.classList.remove('copied');
    }, 2500);
}

function flashSuccessAll(btn, successLabel) {
    var originalHTML = btn.innerHTML;
    btn.innerHTML = CHECK_SVG + ' ' + successLabel;
    btn.classList.add('copied');
    setTimeout(function () {
        btn.innerHTML = originalHTML;
        btn.classList.remove('copied');
    }, 2500);
}

/* ===== Individual copy buttons (Sort Code / Account Number) ===== */
document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
        var targetId = this.getAttribute('data-target');
        var el = document.getElementById(targetId);
        if (!el) return;

        var text = el.textContent.trim();
        var self = this;

        writeToClipboard(text)
            .then(function () {
                flashSuccess(self, 'Copied!');
                showToast('✓ Copied to clipboard!');
            })
            .catch(function () {
                showToast('Could not copy — please select and copy manually.');
            });
    });
});

/* ===== Copy All Bank Details button ===== */
document.getElementById('copy-all-btn').addEventListener('click', function () {
    var accountName   = document.getElementById('account-name').textContent.trim();
    var sortCode      = document.getElementById('sort-code').textContent.trim();
    var accountNumber = document.getElementById('account-number').textContent.trim();

    var allDetails = [
        'Account Name:   ' + accountName,
        'Sort Code:      ' + sortCode,
        'Account Number: ' + accountNumber
    ].join('\n');

    var self = this;

    writeToClipboard(allDetails)
        .then(function () {
            flashSuccessAll(self, 'All Details Copied!');
            showToast('✓ All bank details copied!');
        })
        .catch(function () {
            showToast('Could not copy — please copy the details manually.');
        });
});

/* ===== QR Code generation ===== */
document.addEventListener('DOMContentLoaded', function () {
    var url = window.location.href;

    /* If opened as a local file (no server), the QR code still generates
       correctly — it will simply encode the local path until the site is
       deployed, at which point it will encode the live URL automatically. */
    new QRCode(document.getElementById('qr-code'), {
        text:          url,
        width:         224,
        height:        224,
        colorDark:     '#1b4332',
        colorLight:    '#ffffff',
        correctLevel:  QRCode.CorrectLevel.H
    });
});
