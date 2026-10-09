import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Palette, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  Wrench, 
  Search, 
  Tag, 
  Sliders, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Eye, 
  Sparkles,
  Cpu,
  Building2,
  Clock
} from 'lucide-react';

import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import Drawer from '../components/ui/Drawer';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';
import {
  ComputersIllustration,
  NetworkingIllustration,
  ElectronicsIllustration,
  MeasuringInstrumentsIllustration,
  SoftwareIllustration,
  PeripheralsIllustration,
  ComputerLabBanner,
  NetworkingLabBanner,
  ElectronicsLabBanner,
  IoTLabBanner,
  MechanicalLabBanner,
  SadComputerIllustration,
  FloppyEmptyIllustration,
  OutOfOrderIllustration,
  RetroTerminalArt
} from '../assets';

export default function DesignPreview() {
  const toast = useToast();

  // Component demo states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [demoInput, setDemoInput] = useState('Tektronix TBS1102B-EDU');
  const [demoSelect, setDemoSelect] = useState('available');
  const [btnLoading, setBtnLoading] = useState(false);

  const toggleLoading = () => {
    setBtnLoading(true);
    setTimeout(() => setBtnLoading(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}
    >
      {/* Page Header */}
      <div style={{
        borderBottom: '1px solid var(--color-border-default)',
        paddingBottom: '1.25rem',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div className="font-mono" style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            color: 'var(--color-accent-orange)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '4px'
          }}>
            LABTRACK COMPONENT SPECIFICATION & DESIGN SYSTEM
          </div>
          <h1 style={{ margin: 0 }}>Design System Showcase</h1>
          <p style={{ margin: '0.35rem 0 0 0', fontSize: 'var(--text-base)', maxWidth: '680px' }}>
            Living specification of the "technical instrument panel / lab notebook" aesthetic: warm paper canvas, near-black ink, signal orange accent, and strict status tokens.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="primary" icon={Sparkles} onClick={() => toast.success('Design system loaded with full token specifications.', 'System Verified')}>
            Test Toast
          </Button>
        </div>
      </div>

      {/* 1. Color Palette Swatches */}
      <section className="spec-sheet-panel accent-edge">
        <div className="panel-header">
          <div className="panel-title">
            <Palette size={15} color="var(--color-accent-orange)" />
            <span>1. Core Color & Surface Palette</span>
          </div>
        </div>
        <div className="panel-body">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem'
          }}>
            {/* Canvas */}
            <div style={{ border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-xs)', padding: '0.85rem', backgroundColor: 'var(--color-surface)' }}>
              <div style={{ height: '48px', backgroundColor: 'var(--color-canvas)', border: '1px solid var(--color-border-default)', borderRadius: '2px', marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>Canvas Paper</div>
              <div className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>#F4F1EA • --color-canvas</div>
            </div>

            {/* Surface */}
            <div style={{ border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-xs)', padding: '0.85rem', backgroundColor: 'var(--color-surface)' }}>
              <div style={{ height: '48px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-default)', borderRadius: '2px', marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>Surface White</div>
              <div className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>#FFFFFF • --color-surface</div>
            </div>

            {/* Surface Subtle */}
            <div style={{ border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-xs)', padding: '0.85rem', backgroundColor: 'var(--color-surface)' }}>
              <div style={{ height: '48px', backgroundColor: 'var(--color-surface-subtle)', border: '1px solid var(--color-border-default)', borderRadius: '2px', marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>Surface Subtle</div>
              <div className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>#ECE7DE • --color-surface-subtle</div>
            </div>

            {/* Text Primary */}
            <div style={{ border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-xs)', padding: '0.85rem', backgroundColor: 'var(--color-surface)' }}>
              <div style={{ height: '48px', backgroundColor: 'var(--color-text-primary)', borderRadius: '2px', marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>Near-Black Ink</div>
              <div className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>#16181D • --color-text-primary</div>
            </div>

            {/* Signal Orange Accent */}
            <div style={{ border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-xs)', padding: '0.85rem', backgroundColor: 'var(--color-surface)' }}>
              <div style={{ height: '48px', backgroundColor: 'var(--color-accent-orange)', borderRadius: '2px', marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>Signal Orange</div>
              <div className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>#FF5A1F • --color-accent-orange</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Buttons Showcase */}
      <section className="spec-sheet-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Sliders size={15} color="var(--color-accent-orange)" />
            <span>2. Button System (Variants, Sizes & States)</span>
          </div>
        </div>
        <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Variants */}
          <div>
            <div className="font-mono" style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
              BUTTON VARIANTS
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
              <Button variant="primary" icon={Plus}>Primary Action</Button>
              <Button variant="secondary" icon={Layers}>Secondary Spec</Button>
              <Button variant="dark" icon={Cpu}>Dark Technical</Button>
              <Button variant="danger" icon={Trash2}>Decommission (Danger)</Button>
              <Button variant="ghost" icon={ArrowRight} iconPosition="right">Ghost Action</Button>
            </div>
          </div>

          {/* Sizes & Loading */}
          <div>
            <div className="font-mono" style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
              SIZES & INTERACTIVE LOADING
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.65rem' }}>
              <Button size="sm" variant="secondary" icon={Eye}>Small (0.75rem)</Button>
              <Button size="md" variant="secondary" icon={Wrench}>Medium Default</Button>
              <Button size="lg" variant="secondary" icon={Building2}>Large (0.95rem)</Button>
              <Button variant="primary" loading={btnLoading} onClick={toggleLoading}>
                {btnLoading ? 'Processing Request' : 'Trigger Async Loading'}
              </Button>
              <Button disabled variant="secondary">Disabled State</Button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Badges & Status Indicators */}
      <section className="spec-sheet-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Tag size={15} color="var(--color-accent-orange)" />
            <span>3. Status Indicators & Technical Spec Badges</span>
          </div>
        </div>
        <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <div className="font-mono" style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
              OPERATIONAL STATUS BADGES (WITH ANIMATED PULSE)
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
              <Badge status="available" />
              <Badge status="allocated" />
              <Badge status="under_maintenance" />
              <Badge status="damaged" />
              <Badge status="retired" />
              <span style={{ height: '16px', width: '1px', backgroundColor: 'var(--color-border-default)' }} />
              <Badge status="available" size="sm" />
              <Badge status="damaged" size="sm" />
            </div>
          </div>

          <div>
            <div className="font-mono" style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
              TECHNICAL SPEC & CATEGORY TAGS
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
              <Badge variant="subtle" icon={Tag}>TAG: EQ-EE-2024-001</Badge>
              <Badge variant="subtle" icon={Cpu}>100 MHz • 2-CH</Badge>
              <Badge variant="orange" icon={Sparkles}>NIST Certified</Badge>
              <Badge variant="dark">BUILDING B • ROOM 204</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Form Controls (Input & Select) */}
      <section className="spec-sheet-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Sliders size={15} color="var(--color-accent-orange)" />
            <span>4. Form Controls & Inputs</span>
          </div>
        </div>
        <div className="panel-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {/* Standard Input */}
            <Input
              label="Instrument / Asset Name"
              value={demoInput}
              onChange={(e) => setDemoInput(e.target.value)}
              placeholder="e.g. Rigol DP832 DC Power Supply"
              helperText="Official university laboratory equipment description"
              required
            />

            {/* Monospace Asset Tag Input with Icon */}
            <Input
              label="Asset Tag Identifier"
              icon={Tag}
              mono
              defaultValue="EQ-NET-2024-089"
              helperText="Auto-generated unique RFID / Barcode asset tag"
            />

            {/* Select Dropdown */}
            <Select
              label="Operational Status"
              value={demoSelect}
              onChange={(e) => setDemoSelect(e.target.value)}
              mono
              options={[
                { value: 'available', label: 'AVAILABLE — Ready for allocation' },
                { value: 'allocated', label: 'ALLOCATED — In research use' },
                { value: 'under_maintenance', label: 'UNDER MAINTENANCE — In service' },
                { value: 'damaged', label: 'DAMAGED — Flagged for repair' },
                { value: 'retired', label: 'RETIRED — Decommissioned' }
              ]}
            />

            {/* Input with Error State */}
            <Input
              label="Serial Number (Validation Demo)"
              defaultValue="SN"
              error="Serial number must be at least 4 characters long"
              mono
            />
          </div>
        </div>
      </section>

      {/* 5. Modals, Drawers & Interactive Overlays */}
      <section className="spec-sheet-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Layers size={15} color="var(--color-accent-orange)" />
            <span>5. Modal Dialogs & Slide-In Drawers</span>
          </div>
        </div>
        <div className="panel-body" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <Button variant="primary" icon={Layers} onClick={() => setIsModalOpen(true)}>
            Open Spec Modal Demo
          </Button>

          <Button variant="secondary" icon={Sliders} onClick={() => setIsDrawerOpen(true)}>
            Open Status Drawer Demo
          </Button>
        </div>
      </section>

      {/* 6. Toast Notifications */}
      <section className="spec-sheet-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Sparkles size={15} color="var(--color-accent-orange)" />
            <span>6. Toast Notifications System</span>
          </div>
        </div>
        <div className="panel-body">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
            <Button
              variant="secondary"
              icon={CheckCircle2}
              onClick={() => toast.success('Equipment [EQ-EE-2024-001] marked available and restored to lab bench.', 'Allocation Returned')}
            >
              Success Toast
            </Button>

            <Button
              variant="secondary"
              icon={AlertCircle}
              onClick={() => toast.error('Cannot delete equipment with active checkout loan.', 'Deletion Guard')}
            >
              Error Toast
            </Button>

            <Button
              variant="secondary"
              icon={AlertTriangle}
              onClick={() => toast.warning('Calibration interval expires in 5 days for 3 items.', 'Calibration Due')}
            >
              Warning Toast
            </Button>

            <Button
              variant="secondary"
              icon={Info}
              onClick={() => toast.info('Telemetry updated from Central Lab Complex gateway.', 'Telemetry Sync')}
            >
              Info Toast
            </Button>
          </div>
        </div>
      </section>

      {/* 7. Skeleton Shimmer Loaders */}
      <section className="spec-sheet-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Clock size={15} color="var(--color-accent-orange)" />
            <span>7. Skeleton Shimmer State Placeholders</span>
          </div>
        </div>
        <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <div className="font-mono" style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
              TABLE SHIMMER
            </div>
            <Skeleton variant="table" rows={3} columns={4} />
          </div>

          <div>
            <div className="font-mono" style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
              TEXT LINES SHIMMER
            </div>
            <Skeleton variant="text" count={3} height="12px" />
          </div>
        </div>
      </section>

      {/* 8. Empty States */}
      <section className="spec-sheet-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Layers size={15} color="var(--color-accent-orange)" />
            <span>8. Technical Empty State Specimen</span>
          </div>
        </div>
        <div className="panel-body">
          <EmptyState
            icon={Search}
            title="No Laboratory Assets Found"
            description="No instruments match the active query filters in this laboratory facility."
            action={
              <Button size="sm" variant="secondary" onClick={() => toast.info('Filters reset to default.')}>
                Reset Filter Parameters
              </Button>
            }
          />
        </div>
      </section>

      {/* 9. Retro Risograph & Halftone Imagery System */}
      <section className="spec-sheet-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Sparkles size={15} color="var(--color-accent-orange)" />
            <span>9. Retro Risograph Vector Illustrations & Duotone Filter Suite</span>
          </div>
          <Badge variant="orange">THEME PALETTE ONLY</Badge>
        </div>
        <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Sub 1: Category Risograph SVGs */}
          <div>
            <div className="font-mono" style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem', color: 'var(--color-text-secondary)' }}>
              Category Vectors (2-3 Color Hand-Crafted Risograph SVGs)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
              {[
                { title: '1. Computers', comp: <ComputersIllustration width="100%" height="130px" /> },
                { title: '2. Networking', comp: <NetworkingIllustration width="100%" height="130px" /> },
                { title: '3. Electronics', comp: <ElectronicsIllustration width="100%" height="130px" /> },
                { title: '4. Measuring & Dev', comp: <MeasuringInstrumentsIllustration width="100%" height="130px" /> },
                { title: '5. Software & Licenses', comp: <SoftwareIllustration width="100%" height="130px" /> },
                { title: '6. Peripherals & Fab', comp: <PeripheralsIllustration width="100%" height="130px" /> }
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--color-surface-subtle)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: 'var(--radius-xs)',
                    padding: '0.65rem',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ marginBottom: '0.5rem', overflow: 'hidden' }}>{item.comp}</div>
                  <div className="font-mono" style={{ fontSize: '0.7rem', fontWeight: 700 }}>
                    {item.title}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sub 2: Lab Theme Banners */}
          <div>
            <div className="font-mono" style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem', color: 'var(--color-text-secondary)' }}>
              Laboratory Facility Headers (Halftone & Risograph Banners)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {[
                { name: 'Computer Lab 1', comp: <ComputerLabBanner width="100%" height="100px" /> },
                { name: 'Networking & Telecommunications', comp: <NetworkingLabBanner width="100%" height="100px" /> },
                { name: 'Precision Electronics Lab', comp: <ElectronicsLabBanner width="100%" height="100px" /> },
                { name: 'IoT & Embedded Systems Lab', comp: <IoTLabBanner width="100%" height="100px" /> },
                { name: 'Mechanical & Rapid Prototyping Workshop', comp: <MechanicalLabBanner width="100%" height="100px" /> }
              ].map((lab, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--color-surface-subtle)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: 'var(--radius-xs)',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ height: '100px' }}>{lab.comp}</div>
                  <div className="font-mono" style={{ padding: '0.5rem 0.75rem', fontSize: 'var(--text-xs)', fontWeight: 700, borderTop: '1px solid var(--color-border-subtle)' }}>
                    {lab.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sub 3: Empty State Illustrations & Login Art */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            <div>
              <div className="font-mono" style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem', color: 'var(--color-text-secondary)' }}>
                Empty State Artworks
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <div style={{ backgroundColor: 'var(--color-surface-subtle)', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-xs)', padding: '0.5rem', textAlign: 'center' }}>
                  <SadComputerIllustration width="100%" height="90px" />
                  <div className="font-mono" style={{ fontSize: '0.65rem', fontWeight: 700, marginTop: '4px' }}>No Results</div>
                </div>
                <div style={{ backgroundColor: 'var(--color-surface-subtle)', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-xs)', padding: '0.5rem', textAlign: 'center' }}>
                  <FloppyEmptyIllustration width="100%" height="90px" />
                  <div className="font-mono" style={{ fontSize: '0.65rem', fontWeight: 700, marginTop: '4px' }}>Zero Records</div>
                </div>
                <div style={{ backgroundColor: 'var(--color-surface-subtle)', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-xs)', padding: '0.5rem', textAlign: 'center' }}>
                  <OutOfOrderIllustration width="100%" height="90px" />
                  <div className="font-mono" style={{ fontSize: '0.65rem', fontWeight: 700, marginTop: '4px' }}>Out of Order</div>
                </div>
              </div>
            </div>

            <div>
              <div className="font-mono" style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem', color: 'var(--color-text-secondary)' }}>
                Login Screen Retro Terminal
              </div>
              <div style={{ backgroundColor: 'var(--color-surface-subtle)', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-xs)', padding: '0.5rem' }}>
                <RetroTerminalArt width="100%" height="150px" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Modal Component Demo */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Asset Calibration Verification"
        subtitle="TAG: EQ-EE-2024-001 • BENCH #3"
        icon={Wrench}
        accentEdge
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => { setIsModalOpen(false); toast.success('Calibration verified and committed to ledger.'); }}>
              Commit Calibration
            </Button>
          </>
        }
      >
        <p style={{ fontSize: 'var(--text-sm)', marginBottom: '1rem' }}>
          This modal dialog follows the technical instrument design system with 2px borders, warm surface styling, and crisp typography.
        </p>
        <Input
          label="Certified Technician Name"
          defaultValue="Dr. Arthur Vance (Tektronix Field Certified)"
          required
        />
        <Input
          label="NIST Traceable Certificate ID"
          mono
          defaultValue="NIST-CAL-2024-9981"
          required
        />
      </Modal>

      {/* Interactive Drawer Component Demo */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Quick Operational Drawer"
        subtitle="FACILITY TELEMETRY STREAM"
        icon={Sliders}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>
              Close Drawer
            </Button>
            <Button variant="primary" onClick={() => { setIsDrawerOpen(false); toast.success('Telemetry parameters updated.'); }}>
              Apply Changes
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: 'var(--text-sm)' }}>
            The drawer slides smoothly in from the right edge with spring easing [0.22, 1, 0.36, 1].
          </p>

          <div style={{
            backgroundColor: 'var(--color-surface-subtle)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-xs)',
            padding: '0.85rem'
          }}>
            <div className="font-mono" style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>
              DEVICE SPECIFICATION
            </div>
            <div style={{ fontSize: 'var(--text-sm)', marginTop: '4px' }}>
              Cisco Catalyst 2960-X 24-Port Switch
            </div>
            <div className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              MAC: 00:1A:2B:3C:4D:5E • Rack 2-A
            </div>
          </div>

          <Select
            label="Target State Transition"
            options={[
              { value: 'available', label: 'Mark Available' },
              { value: 'under_maintenance', label: 'Send to Calibration Bay' },
              { value: 'damaged', label: 'Flag Defective Port' }
            ]}
          />
        </div>
      </Drawer>
    </motion.div>
  );
}
