import { useContext } from 'react';
import { createPortal } from 'react-dom';
import { StyleSheet, View } from 'react-native';

import { FramePortalContext } from '../WebPhoneFrame';
import { AppModalProps } from './AppModal';

// Web: react-native's <Modal> always portals to a new node appended to document.body — fine on
// an ordinary page, but it completely escapes WebPhoneFrame's contained, scaled phone silhouette
// on the desktop preview, rendering full browser-width instead of phone-sized. A plain absolutely
// positioned View fixes the sizing but re-introduces a different bug: z-index only wins within
// its own stacking context, so a modal opened from deep inside e.g. the Now tab still couldn't
// out-rank the tab bar or tour overlay, which are siblings much higher up the tree. Portaling
// into a dedicated DOM node that's the LAST child inside the frame (see WebPhoneFrame) solves
// both at once: still visually inside the frame, and always painted last regardless of where in
// the React tree the call site lives.
export function AppModal({ visible, children }: AppModalProps) {
  const portalNode = useContext(FramePortalContext);

  if (!visible) return null;

  const content = <View style={styles.overlay}>{children}</View>;

  if (!portalNode) {
    // Not framed (narrow/mobile browser width) — full-bleed IS the phone here, so a plain
    // absolute overlay in place is already correct; nothing to escape.
    return content;
  }

  return createPortal(content, portalNode);
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
