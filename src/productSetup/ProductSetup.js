import './App.css';
import './styles/description.css'
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux"
import ProductScreen from './screens/ProductScreen';
import DescriptionScreen from './screens/DescriptionScreen';
import CheckmarksScreen from './screens/CheckmarkScreen';
import PlugsScreen from './screens/PlugScreen';
import FeaturesScreen from './screens/FeaturesScreen';
import SpecificationsScreen from './screens/SpecificationsScreen';
import PackageContentsScreen from './screens/PackageContentsScreen';
import WarrantyScreen from './screens/WarrantyScreen';
import ManualsScreen from './screens/ManualsScreen';
import PreviewScreen from './screens/PreviewScreen';
import CrossSellsScreen from './screens/CrossSellsScreen';
import { useNavigate } from 'react-router-dom';

export default function ProductSetup({ clientMode }) {
  const [step, setStep] = useState(0)
  const { sections, user } = useSelector(state => state)
  const navigate = useNavigate()
  useEffect(() => {
    if (!user.access.includes("product-setup") && !user.access.includes("*")) {
      navigate("/home")
    }
  }, [])
  return (
    <div className="description-app" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '64px'}}>
        {clientMode && <style>{`
            body {
                padding: 0;
                overflow: auto;
            }
        `}</style>}
      <div style={{display: 'flex', flexWrap: 'wrap', marginBottom: '48px', gap: '16px'}}>
        <button style={step === 0 ? {backgroundColor: 'orange', color: 'white'} : {}} onClick={() => setStep(0)}>Product{sections.product && ' ✓'}</button>
        <button style={step === 1 ? {backgroundColor: 'orange', color: 'white'} : {}} onClick={() => setStep(1)}>Overview{sections.description.length > 0 && ' ✓'}</button>
        <button style={step === 2 ? {backgroundColor: 'orange', color: 'white'} : {}} onClick={() => setStep(2)}>Checkmarks{sections.checkmarks.length > 0 && ' ✓'}</button>
        <button style={step === 3 ? {backgroundColor: 'orange', color: 'white'} : {}} onClick={() => setStep(3)}>Plugs{sections.plugs.length > 0 && ' ✓'}</button>
        <button style={step === 4 ? {backgroundColor: 'orange', color: 'white'} : {}} onClick={() => setStep(4)}>Features{sections.features.length > 0 && ' ✓'}</button>
        <button style={step === 5 ? {backgroundColor: 'orange', color: 'white'} : {}} onClick={() => setStep(5)}>Specifications{(sections.specifications.left.length > 0 || sections.specifications.right.length > 0) && ' ✓'}</button>
        <button style={step === 6 ? {backgroundColor: 'orange', color: 'white'} : {}} onClick={() => setStep(6)}>Package Contents{sections.packageContents.length > 0 && ' ✓'}</button>
        <button style={step === 7 ? {backgroundColor: 'orange', color: 'white'} : {}} onClick={() => setStep(7)}>Warranty{sections.warranty.length > 0 && ' ✓'}</button>
        <button style={step === 8 ? {backgroundColor: 'orange', color: 'white'} : {}} onClick={() => setStep(8)}>Manuals{sections.manuals.length > 0 && ' ✓'}</button>
        <button style={step === 9 ? {backgroundColor: 'orange', color: 'white'} : {}} onClick={() => setStep(9)}>Cross Sells{sections.crossSells.length > 0 && ' ✓'}</button>
        <button style={step === 10 ? {backgroundColor: 'orange', color: 'white'} : {}} onClick={() => setStep(10)}>Preview &amp; Submit</button>

      </div>

      {step === 0 && <ProductScreen />}
      {step === 1 && <DescriptionScreen />}
      {step === 2 && <CheckmarksScreen />}
      {step === 3 && <PlugsScreen />}
      {step === 4 && <FeaturesScreen />}
      {step === 5 && <SpecificationsScreen />}
      {step === 6 && <PackageContentsScreen />}
      {step === 7 && <WarrantyScreen />}
      {step === 8 && <ManualsScreen />}
      {step === 9 && <CrossSellsScreen />}
      {step === 10 && <PreviewScreen />}
    </div>
  );
}