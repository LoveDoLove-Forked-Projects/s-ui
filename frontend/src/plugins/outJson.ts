import { Hysteria, Hysteria2, Inbound, InTypes, Shadowsocks, Trojan, TUIC, VLESS, VMess, ShadowTLS } from "@/types/inbounds"
import { iTls } from "@/types/inTls"
import { oTls } from "@/types/outTls"
import RandomUtil from "./randomUtil"

export function fillData(inbound: Inbound, tls: any | null = null) {
  if (tls != null) {
    addTls(inbound.out_json, tls.server, tls.client)
  } else {
    delete inbound.out_json.tls
  }
  inbound.out_json.type = inbound.type
  inbound.out_json.tag = inbound.tag
  inbound.out_json.server = location.hostname
  inbound.out_json.server_port = inbound.listen_port
  switch(inbound.type){
    case InTypes.HTTP: case InTypes.SOCKS: case InTypes.Mixed:
      return
    case InTypes.Shadowsocks:
      shadowsocksOut(inbound.out_json, <Shadowsocks>inbound)
      return
    case InTypes.ShadowTLS:
      shadowTlsOut(inbound.out_json, <ShadowTLS>inbound)
      return
    case InTypes.Hysteria:
      hysteriaOut(inbound.out_json, <Hysteria>inbound)
      return
    case InTypes.Hysteria2:
      hysteria2Out(inbound.out_json, <Hysteria2>inbound)
      return
    case InTypes.TUIC:
      tuicOut(inbound.out_json, <TUIC>inbound)
      return
    case InTypes.VLESS:
      vlessOut(inbound.out_json, <VLESS>inbound)
      return
    case InTypes.Trojan:
      trojanOut(inbound.out_json, <Trojan>inbound)
      return
    case InTypes.VMess:
      vmessOut(inbound.out_json, <VMess>inbound)
      return
  }
  Object.keys(inbound.out_json).forEach(key => delete inbound.out_json[key])
}

function addTls(out: any, tls: iTls, tlsClient: oTls){
  out.tls = tlsClient?? {}
  if(tls.enabled) out.tls.enabled = tls.enabled
  if(tls.server_name) out.tls.server_name = tls.server_name
  if(tls.alpn) out.tls.alpn = tls.alpn
  if(tls.min_version) out.tls.min_version = tls.min_version
  if(tls.max_version) out.tls.max_version = tls.max_version
  if(tls.cipher_suites) out.tls.cipher_suites = tls.cipher_suites
  if(tls.reality?.enabled){
    out.tls.reality.enabled = true
    out.tls.reality.short_id = tls.reality.short_id[RandomUtil.randomInt(tls.reality.short_id.length)]
  }
}

function shadowsocksOut(out: any, inbound: Shadowsocks) {
  out.method = inbound.method
}

function shadowTlsOut(out: any, inbound: ShadowTLS) {
  if (inbound.version == 3) {
    out.version = 3
  } else {
    Object.keys(out).forEach(key => delete out[key])
  }
  out.tls = { enabled: true }
}

function hysteriaOut(out: any, inbound: Hysteria) {
  out.up_mbps = inbound.down_mbps
  out.down_mbps = inbound.up_mbps
  out.obfs = inbound.obfs
  out.recv_window_conn = inbound.recv_window_conn
  out.disable_mtu_discovery = inbound.disable_mtu_discovery
}

function hysteria2Out(out: any, inbound: Hysteria2) {
  out.up_mbps = inbound.down_mbps
  out.down_mbps = inbound.up_mbps
  out.obfs = inbound.obfs
}

function tuicOut(out: any, inbound: TUIC) {
  out.congestion_control = inbound.congestion_control?? "cubic"
  out.zero_rtt_handshake = inbound.zero_rtt_handshake
  out.heartbeat = inbound.heartbeat
}

function vlessOut(out: any, inbound: VLESS) {
  out.transport = inbound.transport
}

function trojanOut(out: any, inbound: Trojan) {
  out.transport = inbound.transport
}

function vmessOut(out: any, inbound: VMess) {
  out.transport = inbound.transport
}
